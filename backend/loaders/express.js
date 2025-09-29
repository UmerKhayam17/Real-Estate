// loaders/express.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('../routes');
const errorHandler = require('../middlewares/error.middleware');

module.exports = (app) => {
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  // Configure CORS properly
  app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true, // Allow credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
  
  app.use(morgan('dev'));

  // static uploads (local fallback)
  app.use('/uploads', express.static('uploads'));

  // mount API routes
  app.use('/api', routes);

  // 404
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
  });

  // global error handler
  app.use(errorHandler);
};