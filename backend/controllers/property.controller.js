// backend/controllers/property.controller.js
const Property = require('../models/Property.model');
const Inquiry = require('../models/Inquiry.model');
const fs = require('fs');
const path = require('path');

// CREATE property
exports.createProperty = async (req, res, next) => {
  try {
    const data = req.body;
    data.agent = req.user.id;

    // Handle file uploads
    if (req.files && req.files.length) {
      data.media = req.files.map((file, index) => ({
        url: `/uploads/user_${req.user.id}/${file.filename}`,
        type: file.mimetype.startsWith('image/') ? 'image' : 'video',
        isMain: index === 0, // First image as main
        caption: req.body.captions ? (req.body.captions[index] || '') : ''
      }));
    }

    const property = await Property.create(data);
    res.status(201).json(property);
  } catch (err) {
    // Cleanup uploaded files if error occurs
    if (req.files && req.files.length) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    next(err);
  }
};

// GET ALL properties
exports.getProperties = async (req, res, next) => {
  try {
    const query = req.query;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;

    const filter = {};

    // Search and filter parameters
    if (query.q) filter.$text = { $search: query.q };
    if (query.city) filter['address.city'] = query.city;
    if (query.type && query.type !== 'all') filter.type = query.type;
    if (query.saleOrRent && query.saleOrRent !== 'all') filter.saleOrRent = query.saleOrRent;
    if (query.status && query.status !== 'all') filter.status = query.status;
    if (query.approved !== undefined) filter.approved = query.approved === 'true';

    if (query.bedrooms) filter.bedrooms = Number(query.bedrooms);
    if (query.bathrooms) filter.bathrooms = Number(query.bathrooms);

    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    // Location-based search
    if (query.lat && query.lng) {
      const meters = query.radius ? Number(query.radius) * 1000 : 5000;
      filter.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(query.lng), Number(query.lat)] },
          $maxDistance: meters
        }
      };
    }

    // Sorting
    let sortObj = { createdAt: -1 };
    if (query.sort === 'price_asc') sortObj = { price: 1 };
    if (query.sort === 'price_desc') sortObj = { price: -1 };
    if (query.sort === 'views') sortObj = { views: -1 };

    const skip = (page - 1) * limit;
    const total = await Property.countDocuments(filter);
    const items = await Property.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortObj)
      .populate('agent', 'name email phone');

    res.json({
      total,
      page: page,
      limit: limit,
      items
    });
  } catch (err) {
    next(err);
  }
};

// GET SINGLE property
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('agent', 'name email phone');

    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    next(err);
  }
};

// UPDATE property
exports.updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Check ownership
    if (String(property.agent) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    console.log('🔄 Update request body:', req.body);
    console.log('🔄 Update files:', req.files);

    // Update basic fields
    const updateData = { ...req.body };

    // Handle location update
    if (req.body.location && req.body.location.coordinates) {
      property.location = {
        type: 'Point',
        coordinates: req.body.location.coordinates.map(coord => parseFloat(coord))
      };
    }

    // Update address if provided
    if (req.body.address) {
      property.address = { ...property.address, ...req.body.address };
    }

    // Update other fields
    const fieldsToUpdate = ['title', 'description', 'price', 'currency', 'type',
      'saleOrRent', 'status', 'bedrooms', 'bathrooms', 'area', 'features'];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        property[field] = req.body[field];
      }
    });

    // Handle media updates - this is the key part
    if (req.body.media && typeof req.body.media === 'string') {
      try {
        const mediaUpdates = JSON.parse(req.body.media);

        // Update existing media metadata (captions, isMain, etc.)
        mediaUpdates.forEach(mediaUpdate => {
          if (mediaUpdate._id) {
            // Update existing media item
            const existingMedia = property.media.id(mediaUpdate._id);
            if (existingMedia) {
              if (mediaUpdate.caption !== undefined) existingMedia.caption = mediaUpdate.caption;
              if (mediaUpdate.isMain !== undefined) existingMedia.isMain = mediaUpdate.isMain;
            }
          }
        });

        // Handle main image changes
        const newMainMedia = mediaUpdates.find(media => media.isMain);
        if (newMainMedia && newMainMedia._id) {
          // Reset all main flags
          property.media.forEach(media => {
            media.isMain = false;
          });
          // Set the new main media
          const mainMedia = property.media.id(newMainMedia._id);
          if (mainMedia) {
            mainMedia.isMain = true;
          }
        }
      } catch (error) {
        console.error('Error parsing media updates:', error);
      }
    }

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      const newMedia = req.files.map((file, index) => ({
        url: `/uploads/user_${req.user.id}/${file.filename}`,
        type: file.mimetype.startsWith('image/') ? 'image' : 'video',
        isMain: property.media.length === 0 && index === 0, // Set as main if no existing media
        caption: req.body.captions ? (req.body.captions[index] || '') : ''
      }));

      property.media.push(...newMedia);
    }

    // Handle media deletions if mediaIdsToDelete is provided
    if (req.body.mediaIdsToDelete) {
      const mediaIdsToDelete = Array.isArray(req.body.mediaIdsToDelete)
        ? req.body.mediaIdsToDelete
        : JSON.parse(req.body.mediaIdsToDelete);

      mediaIdsToDelete.forEach(mediaId => {
        const mediaToDelete = property.media.id(mediaId);
        if (mediaToDelete) {
          // Delete file from filesystem
          const filePath = mediaToDelete.url.replace('/uploads/', 'uploads/');
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          // Remove from array
          property.media.pull(mediaId);
        }
      });

      // If we deleted the main media and there are other media, set first one as main
      if (property.media.length > 0 && !property.media.some(media => media.isMain)) {
        property.media[0].isMain = true;
      }
    }

    await property.save();
    res.json(property);
  } catch (err) {
    // Cleanup uploaded files if error occurs
    if (req.files && req.files.length) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    next(err);
  }
};

// DELETE property
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Check ownership
    if (String(property.agent) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Cleanup all media files
    if (property.media && property.media.length) {
      property.media.forEach(media => {
        const filePath = media.url.replace('/uploads/', 'uploads/');
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// create inquiry (lead)
exports.contactProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const data = {
      property: property._id,
      fromUser: req.user ? req.user.id : null,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message
    };

    const inquiry = await Inquiry.create(data);
    // TODO: notify agent (email/SMS)
    res.status(201).json(inquiry);
  } catch (err) {
    next(err);
  }
};