// components/common/ImageUpload.jsx
'use client';

import React from 'react';
import FileUpload from './FileUpload';

const ImageUpload = ({ value = [], onChange, ...props }) => {
   return (
      <FileUpload
         label="Upload Images"
         acceptedTypes="image/*"
         helperText="Drag & drop images here or click to browse"
         value={value}
         onChange={onChange}
         {...props}
      />
   );
};

export default ImageUpload;