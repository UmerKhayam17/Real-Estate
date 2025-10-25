// components/common/VideoUpload.jsx
'use client';

import React from 'react';
import FileUpload from './FileUpload';

const VideoUpload = ({ value = [], onChange, ...props }) => {
   return (
      <FileUpload
         label="Upload Videos"
         acceptedTypes="video/*"
         helperText="Drag & drop videos here or click to browse"
         value={value}
         onChange={onChange}
         {...props}
      />
   );
};

export default VideoUpload;