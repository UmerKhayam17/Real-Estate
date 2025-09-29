// controllers/property.controller.js
const Property = require('../models/Property.model');
const Inquiry = require('../models/Inquiry.model');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

exports.createProperty = async (req, res, next) => {
  try {
    const data = req.body;
    data.agent = req.user.id;
    // parse location if provided as "lng,lat"
    if (data.location && typeof data.location === 'string') {
      const [lng, lat] = data.location.split(',').map(Number);
      data.location = { type: 'Point', coordinates: [lng, lat] };
    }

    // handle uploads: prefer cloudinary if configured
    if (req.files && req.files.length) {
      const urls = [];
      for (const file of req.files) {
        if (cloudinary.config().api_key) {
          const result = await cloudinary.uploader.upload(file.path, { folder: 'properties' });
          urls.push(result.secure_url);
          fs.unlinkSync(file.path);
        } else {
          urls.push(`/uploads/${file.filename}`);
        }
      }
      data.images = urls;
    }

    const property = await Property.create(data);
    res.status(201).json(property);
  } catch (err) {
    next(err);
  }
};

exports.getProperties = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 12, q, city, minPrice, maxPrice, bedrooms, bathrooms,
      lat, lng, radius, sort
    } = req.query;
    const filter = { approved: true };

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

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(filter);
    const items = await Property.find(filter).skip(skip).limit(Number(limit)).sort(sortObj).populate('agent', 'name email phone');

    res.json({ total, page: Number(page), limit: Number(limit), items });
  } catch (err) {
    next(err);
  }
};

exports.getProperty = async (req, res, next) => {
  try {
    const prop = await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate('agent', 'name email phone');
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
    if (String(prop.agent) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    Object.assign(prop, req.body);

    // handle files similarly as create...
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
    if (String(prop.agent) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    // cleanup local files if any
    if (prop.images && prop.images.length) {
      prop.images.forEach(img => {
        if (img.startsWith('/uploads/')) {
          const p = img.replace('/uploads/', 'uploads/');
          if (fs.existsSync(p)) fs.unlinkSync(p);
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
