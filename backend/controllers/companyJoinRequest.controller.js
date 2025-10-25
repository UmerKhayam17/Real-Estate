// controllers/companyJoinRequest.controller.js
const { Dealer, Company, User } = require('../models');
const { sendMail, emailTemplates } = require('../services/email.service');

// Get company's pending join requests (for company admin)
exports.getCompanyPendingRequests = async (req, res, next) => {
   try {
      const { companyId } = req.user;
      const { role } = req.user;

      if (role !== 'company_admin') {
         return res.status(403).json({
            message: "Access denied. Company admin only."
         });
      }

      const company = await Company.findById(companyId)
         .populate('pendingJoinRequests.dealerId');

      if (!company) {
         return res.status(404).json({ message: "Company not found" });
      }

      // Get detailed dealer info for each request
      const pendingRequests = await Promise.all(
         company.pendingJoinRequests.map(async (request) => {
            const dealer = await Dealer.findById(request.dealerId)
               .populate('userId', 'name email phone')
               .select('businessName yearsOfExperience specialization officeAddress officeCity rating totalSales');

            return {
               requestId: request._id,
               dealer: {
                  id: dealer._id,
                  userId: dealer.userId._id,
                  name: dealer.userId.name,
                  email: dealer.userId.email,
                  phone: dealer.userId.phone,
                  businessName: dealer.businessName,
                  yearsOfExperience: dealer.yearsOfExperience,
                  specialization: dealer.specialization,
                  officeAddress: dealer.officeAddress,
                  officeCity: dealer.officeCity,
                  rating: dealer.rating,
                  totalSales: dealer.totalSales
               },
               requestedAt: request.requestedAt
            };
         })
      );

      res.status(200).json({
         pendingRequests,
         totalPending: pendingRequests.length,
         dealerLimit: company.planLimitations.maxDealers,
         currentDealers: company.totalDealers,
         canAcceptMore: company.canAddDealer
      });

   } catch (err) {
      next(err);
   }
};

// Company admin approves/rejects join request
exports.respondToJoinRequest = async (req, res, next) => {
   try {
      const { requestId } = req.params;
      const { action, reason } = req.body;
      const { companyId, id: adminId } = req.user;

      const company = await Company.findById(companyId);
      if (!company) {
         return res.status(404).json({ message: "Company not found" });
      }

      // Find the request in company's pending requests
      const request = company.pendingJoinRequests.id(requestId);
      if (!request) {
         return res.status(404).json({ message: "Join request not found" });
      }

      const dealer = await Dealer.findById(request.dealerId)
         .populate('userId', 'name email');

      if (!dealer) {
         return res.status(404).json({ message: "Dealer not found" });
      }

      if (action === 'approve') {
         // Check if company can still accept dealers
         if (!company.canAddDealer) {
            return res.status(400).json({
               message: "Company has reached dealer limit. Cannot accept more dealers."
            });
         }

         // Update dealer's company join request and company ID
         dealer.companyJoinRequest.status = 'approved';
         dealer.companyJoinRequest.respondedAt = new Date();
         dealer.companyJoinRequest.responseReason = reason;
         dealer.companyJoinRequest.respondedBy = adminId;
         dealer.companyId = companyId;
         await dealer.save();

         // Update company stats and remove from pending
         company.totalDealers += 1;
         company.pendingJoinRequests = company.pendingJoinRequests.filter(
            req => !req.dealerId.equals(request.dealerId)
         );
         await company.save();

         // Notify dealer
         await sendMail({
            to: dealer.userId.email,
            ...emailTemplates.companyJoinRequestApproved(
               dealer.userId.name,
               company.name,
               reason
            ),
         });

         res.status(200).json({
            message: "Dealer join request approved successfully",
            dealer: {
               id: dealer._id,
               name: dealer.userId.name,
               businessName: dealer.businessName
            }
         });

      } else if (action === 'reject') {
         // Update dealer's join request status
         dealer.companyJoinRequest.status = 'rejected';
         dealer.companyJoinRequest.respondedAt = new Date();
         dealer.companyJoinRequest.responseReason = reason;
         dealer.companyJoinRequest.respondedBy = adminId;
         await dealer.save();

         // Remove from company's pending requests
         company.pendingJoinRequests = company.pendingJoinRequests.filter(
            req => !req.dealerId.equals(request.dealerId)
         );
         await company.save();

         // Notify dealer
         await sendMail({
            to: dealer.userId.email,
            ...emailTemplates.companyJoinRequestRejected(
               dealer.userId.name,
               company.name,
               reason
            ),
         });

         res.status(200).json({
            message: "Dealer join request rejected",
            reason
         });

      } else {
         res.status(400).json({ message: "Invalid action" });
      }

   } catch (err) {
      next(err);
   }
};

// Get all companies for dropdown (simple list)
exports.getCompaniesList = async (req, res, next) => {
   try {
      const { search } = req.query;

      let filter = {
         status: 'approved',
         // subscriptionStatus: 'active'
      };

      if (search) {
         filter.name = { $regex: search, $options: 'i' };
      }

      const companies = await Company.find(filter)
         .select('name email city totalDealers planLimitations')
         .sort({ name: 1 })
         .limit(20); // Limit for dropdown

      const formattedCompanies = companies.map(company => ({
         id: company._id,
         name: company.name,
         email: company.email,
         city: company.city,
         dealerSlots: company.planLimitations.maxDealers - company.totalDealers,
         canJoin: company.canAddDealer
      }));

      res.status(200).json({
         companies: formattedCompanies
      });

   } catch (err) {
      next(err);
   }
};