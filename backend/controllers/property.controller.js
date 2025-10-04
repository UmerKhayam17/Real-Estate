const Property = require('../models/Property.model');
const Inquiry = require('../models/Inquiry.model');
const fs = require('fs');
const path = require('path');

exports.createProperty = async (req, res, next) => {
  try {
    const data = req.body;
    data.agent = req.user.id;
    // Parse location if provided as "lng,lat"
    if (data.location && typeof data.location === 'string') {
      const [lng, lat] = data.location.split(',').map(Number);
      data.location = { type: 'Point', coordinates: [lng, lat] };
    }

    // Handle file uploads
    if (req.files && req.files.length) {
      data.media = [];

      req.files.forEach((file, index) => {
        const mediaItem = {
          url: `/uploads/user_${req.user.id}/${file.filename}`,
          type: file.mimetype.startsWith('image/') ? 'image' : 'video',
          isMain: false, // Will be set based on mainImageIndex
          caption: req.body.captions ? (req.body.captions[index] || '') : ''
        };

        data.media.push(mediaItem);
      });

      // Set main image based on user selection
      const mainImageIndex = parseInt(req.body.mainImageIndex);
      if (!isNaN(mainImageIndex)) {
        // Ensure the index is valid
        if (mainImageIndex >= 0 && mainImageIndex < data.media.length) {
          data.media[mainImageIndex].isMain = true;
        } else {
          // Default to first image if invalid index
          data.media[0].isMain = true;
        }
      } else {
        // Default to first image if no main image specified
        data.media[0].isMain = true;
      }
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

exports.updatePropertyMedia = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (String(property.agent) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Handle new file uploads
    if (req.files && req.files.length) {
      const newMedia = [];

      req.files.forEach((file, index) => {
        const mediaItem = {
          url: `/uploads/user_${req.user.id}/${file.filename}`,
          type: file.mimetype.startsWith('image/') ? 'image' : 'video',
          isMain: false,
          caption: req.body.captions ? (req.body.captions[index] || '') : ''
        };

        newMedia.push(mediaItem);
      });

      // Add new media to existing media
      property.media.push(...newMedia);

      // Set main image if specified
      const mainImageIndex = parseInt(req.body.mainImageIndex);
      if (!isNaN(mainImageIndex)) {
        // Reset all main flags
        property.media.forEach(media => {
          media.isMain = false;
        });

        // Set new main media (index relative to all media)
        const actualIndex = property.media.length - newMedia.length + mainImageIndex;
        if (actualIndex >= 0 && actualIndex < property.media.length) {
          property.media[actualIndex].isMain = true;
        }
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

exports.setMainMedia = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (String(property.agent) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const mediaId = req.body.mediaId;
    const mediaItem = property.media.id(mediaId);

    if (!mediaItem) {
      return res.status(404).json({ message: 'Media item not found' });
    }

    // Reset all main flags
    property.media.forEach(media => {
      media.isMain = false;
    });

    // Set the selected media as main
    mediaItem.isMain = true;

    await property.save();
    res.json(property);
  } catch (err) {
    next(err);
  }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (String(property.agent) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const mediaId = req.body.mediaId;
    const mediaItem = property.media.id(mediaId);

    if (!mediaItem) {
      return res.status(404).json({ message: 'Media item not found' });
    }

    // Delete file from filesystem
    const filePath = mediaItem.url.replace('/uploads/', 'uploads/');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from array
    property.media.pull(mediaId);

    // If we deleted the main media and there are other media, set first one as main
    if (mediaItem.isMain && property.media.length > 0) {
      property.media[0].isMain = true;
    }

    await property.save();
    res.json(property);
  } catch (err) {
    next(err);
  }
};

exports.getProperties = async (req, res, next) => {
  try {
    const query = req.query;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;
    const q = query.q;
    const city = query.city;
    const minPrice = query.minPrice;
    const maxPrice = query.maxPrice;
    const bedrooms = query.bedrooms;
    const bathrooms = query.bathrooms;
    const lat = query.lat;
    const lng = query.lng;
    const radius = query.radius;
    const sort = query.sort;

    const filter = {  };

    if (q) filter.$text = { $search: q };
    if (city) filter['address.city'] = city;
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (bathrooms) filter.bathrooms = Number(bathrooms);
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (lat && lng) {
      const meters = radius ? Number(radius) * 1000 : 5000;
      filter.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: meters
        }
      };
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'views') sortObj = { views: -1 };

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

exports.getProperty = async (req, res, next) => {
  try {
    const prop = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('agent', 'name email phone');

    if (!prop) return res.status(404).json({ message: 'Property not found' });
    res.json(prop);
  } catch (err) {
    next(err);
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Property not found' });
    if (String(prop.agent) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.assign(prop, req.body);

    // Parse location if provided as "lng,lat"
    if (req.body.location && typeof req.body.location === 'string') {
      const [lng, lat] = req.body.location.split(',').map(Number);
      prop.location = { type: 'Point', coordinates: [lng, lat] };
    }

    await prop.save();
    res.json(prop);
  } catch (err) {
    next(err);
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Property not found' });
    if (String(prop.agent) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Cleanup all media files
    if (prop.media && prop.media.length) {
      prop.media.forEach(media => {
        const filePath = media.url.replace('/uploads/', 'uploads/');
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await prop.deleteOne();
    res.json({ message: 'Deleted' });
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