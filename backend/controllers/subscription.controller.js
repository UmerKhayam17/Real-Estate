// controllers/subscription.controller.js
const { Company, Plan } = require('../models');

// ----------------- ASSIGN PLAN TO COMPANY -----------------
exports.assignPlanToCompany = async (req, res, next) => {
  try {
    const { companyId, planId } = req.body;
    const { role } = req.user;

    // Only super admin can assign plans
    if (role !== 'super_admin') {
      return res.status(403).json({ message: "Access denied. Super admin only." });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const plan = await Plan.findOne({ _id: planId, deleted: false, isActive: true });
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Update company plan
    company.currentPlan = plan._id;
    company.subscriptionStatus = 'active';
    company.planLimitations = {
      maxDealers: plan.limitations.maxDealers,
      maxProperties: plan.limitations.maxProperties,
      features: plan.limitations.features
    };

    // Add to plan history
    company.planHistory.push({
      planId: plan._id,
      planName: plan.name,
      price: plan.price,
      startDate: new Date(),
      endDate: new Date(Date.now() + plan.validateDays * 24 * 60 * 60 * 1000),
      status: 'active',
      purchasedAt: new Date()
    });

    await company.save();

    // Populate plan details for response
    await company.populate('currentPlan');

    res.status(200).json({
      message: "Plan assigned to company successfully",
      company: {
        id: company._id,
        name: company.name,
        currentPlan: company.currentPlan,
        subscriptionStatus: company.subscriptionStatus,
        planLimitations: company.planLimitations
      }
    });
  } catch (err) {
    next(err);
  }
};

// ----------------- GET COMPANY PLAN DETAILS -----------------
exports.getCompanyPlanDetails = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const company = await Company.findById(companyId)
      .populate('currentPlan')
      .populate('planHistory.planId', 'name description limitations');

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      currentPlan: company.currentPlan,
      subscriptionStatus: company.subscriptionStatus,
      planLimitations: company.planLimitations,
      planHistory: company.planHistory,
      usage: {
        dealers: company.totalDealers,
        maxDealers: company.planLimitations.maxDealers,
        remainingDealers: company.planLimitations.maxDealers - company.totalDealers,
        properties: company.totalProperties,
        maxProperties: company.planLimitations.maxProperties,
        remainingProperties: company.planLimitations.maxProperties - company.totalProperties
      },
      canAddDealer: company.canAddDealer,
      canAddProperty: company.canAddProperty
    });
  } catch (err) {
    next(err);
  }
};

// ----------------- UPGRADE/DOWNGRADE PLAN -----------------
exports.changeCompanyPlan = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const companyId = req.user.companyId;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const newPlan = await Plan.findOne({ _id: planId, deleted: false, isActive: true });
    if (!newPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Check if new plan can accommodate current usage
    if (company.totalDealers > newPlan.limitations.maxDealers) {
      return res.status(400).json({
        message: `Cannot switch to this plan. Current ${company.totalDealers} dealers exceed plan limit of ${newPlan.limitations.maxDealers}.`
      });
    }

    if (company.totalProperties > newPlan.limitations.maxProperties) {
      return res.status(400).json({
        message: `Cannot switch to this plan. Current ${company.totalProperties} properties exceed plan limit of ${newPlan.limitations.maxProperties}.`
      });
    }

    // Mark current plan as expired in history
    const currentActivePlan = company.planHistory.find(plan => plan.status === 'active');
    if (currentActivePlan) {
      currentActivePlan.status = 'expired';
      currentActivePlan.endDate = new Date();
    }

    // Update company with new plan
    company.currentPlan = newPlan._id;
    company.planLimitations = {
      maxDealers: newPlan.limitations.maxDealers,
      maxProperties: newPlan.limitations.maxProperties,
      features: newPlan.limitations.features
    };

    // Add new plan to history
    company.planHistory.push({
      planId: newPlan._id,
      planName: newPlan.name,
      price: newPlan.price,
      startDate: new Date(),
      endDate: new Date(Date.now() + newPlan.validateDays * 24 * 60 * 60 * 1000),
      status: 'active',
      purchasedAt: new Date()
    });

    await company.save();

    await company.populate('currentPlan');

    res.status(200).json({
      message: "Plan changed successfully",
      newPlan: company.currentPlan,
      planLimitations: company.planLimitations,
      subscriptionStatus: company.subscriptionStatus
    });
  } catch (err) {
    next(err);
  }
};

// ----------------- CHECK PLAN LIMITATIONS -----------------
exports.checkPlanLimitations = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const { action } = req.query; // 'add_dealer' or 'add_property'

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    let canProceed = false;
    let message = '';

    switch (action) {
      case 'add_dealer':
        canProceed = company.canAddDealer;
        message = canProceed
          ? `Can add dealer. ${company.planLimitations.maxDealers - company.totalDealers} slots remaining.`
          : `Dealer limit reached. Maximum ${company.planLimitations.maxDealers} dealers allowed.`;
        break;

      case 'add_property':
        canProceed = company.canAddProperty;
        message = canProceed
          ? `Can add property. ${company.planLimitations.maxProperties - company.totalProperties} slots remaining.`
          : `Property limit reached. Maximum ${company.planLimitations.maxProperties} properties allowed.`;
        break;

      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    res.status(200).json({
      canProceed,
      message,
      limitations: company.planLimitations,
      currentUsage: {
        dealers: company.totalDealers,
        properties: company.totalProperties
      }
    });
  } catch (err) {
    next(err);
  }
};