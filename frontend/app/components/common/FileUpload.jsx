// components/common/FileUpload.jsx
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { FiUpload, FiX, FiImage, FiVideo, FiFile } from 'react-icons/fi';

const FileUpload = ({
   label = 'Upload Files',
   acceptedTypes = 'image/*,video/*',
   multiple = true,
   maxSize = 10 * 1024 * 1024, // 10MB in bytes
   value = [],
   onChange,
   helperText = 'Drag & drop files here or click to browse',
   className = ''
}) => {
   const [isDragging, setIsDragging] = useState(false);
   const [error, setError] = useState('');
   const fileInputRef = useRef(null);

   // Handle file validation
   const validateFile = (file) => {
      if (file.size > maxSize) {
         return `File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`;
      }

      if (!file.type.match('image.*') && !file.type.match('video.*')) {
         return `File ${file.name} is not an image or video`;
      }

      return null;
   };

   // Process selected files
   const processFiles = useCallback((files) => {
      const validFiles = [];
      const errors = [];

      Array.from(files).forEach(file => {
         const validationError = validateFile(file);
         if (validationError) {
            errors.push(validationError);
         } else {
            // Create object URL for preview
            const fileWithPreview = {
               file,
               preview: URL.createObjectURL(file),
               name: file.name,
               type: file.type,
               size: file.size
            };
            validFiles.push(fileWithPreview);
         }
      });

      if (errors.length > 0) {
         setError(errors.join(', '));
      }

      if (validFiles.length > 0) {
         const newFiles = multiple ? [...value, ...validFiles] : validFiles;
         onChange(newFiles);
         setError('');
      }
   }, [value, multiple, maxSize]);

   // Handle drag events
   const handleDragOver = useCallback((e) => {
      e.preventDefault();
      setIsDragging(true);
   }, []);

   const handleDragLeave = useCallback((e) => {
      e.preventDefault();
      setIsDragging(false);
   }, []);

   const handleDrop = useCallback((e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      processFiles(files);
   }, [processFiles]);

   // Handle file input change
   const handleFileInputChange = (e) => {
      const files = e.target.files;
      processFiles(files);
      // Reset input to allow selecting same file again
      e.target.value = '';
   };

   // Remove file
   const removeFile = (index) => {
      const newFiles = value.filter((_, i) => i !== index);
      onChange(newFiles);
   };

   // Get file icon based on type
   const getFileIcon = (fileType) => {
      if (fileType?.startsWith('image/')) return <FiImage className="w-5 h-5" />;
      if (fileType?.startsWith('video/')) return <FiVideo className="w-5 h-5" />;
      return <FiFile className="w-5 h-5" />;
   };

   // Format file size - FIXED: Handle undefined/NaN values
   const formatFileSize = (bytes) => {
      if (!bytes || bytes === 0 || isNaN(bytes)) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
   };

   // Get safe file properties
   const getSafeFileProperties = (file) => {
      return {
         name: file.name || 'Unknown file',
         type: file.type || 'application/octet-stream',
         size: file.size || 0,
         preview: file.preview || '',
         file: file.file || file
      };
   };

   return (
      <div className={`space-y-4 ${className}`}>
         <label className="block text-sm font-medium text-gray-700">
            {label}
         </label>

         {/* Drop Zone */}
         <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${isDragging
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
               }
          ${error ? 'border-red-300' : ''}
        `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
         >
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
               <p className="text-sm font-medium text-gray-900">
                  {isDragging ? 'Drop files here' : 'Drag & drop files here'}
               </p>
               <p className="text-sm text-gray-500 mt-1">
                  {helperText}
               </p>
               <p className="text-xs text-gray-400 mt-1">
                  Supported: Images & Videos • Max: {maxSize / 1024 / 1024}MB per file
               </p>
            </div>
            <input
               ref={fileInputRef}
               type="file"
               className="hidden"
               accept={acceptedTypes}
               multiple={multiple}
               onChange={handleFileInputChange}
            />
         </div>

         {/* Error Message */}
         {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
               {error}
            </p>
         )}

         {/* File Previews */}
         {value.length > 0 && (
            <div className="space-y-3">
               <h4 className="text-sm font-medium text-gray-700">
                  Selected Files ({value.length})
               </h4>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {value.map((file, index) => {
                     const safeFile = getSafeFileProperties(file);

                     return (
                        <div key={index} className="relative border border-gray-200 rounded-lg p-3 group hover:border-gray-300 transition-colors">
                           {/* Remove Button */}
                           <button
                              type="button"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 removeFile(index);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                           >
                              <FiX className="w-3 h-3" />
                           </button>

                           {/* File Preview */}
                           {safeFile.type?.startsWith('image/') ? (
                              <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                                 <img
                                    src={safeFile.preview}
                                    alt={safeFile.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                       e.target.src = '/api/placeholder/200/200';
                                    }}
                                 />
                              </div>
                           ) : safeFile.type?.startsWith('video/') ? (
                              <div className="aspect-video bg-gray-800 rounded-md flex items-center justify-center">
                                 <FiVideo className="w-8 h-8 text-white" />
                              </div>
                           ) : (
                              <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                                 {getFileIcon(safeFile.type)}
                              </div>
                           )}

                           {/* File Info */}
                           <div className="mt-2 space-y-1">
                              <p className="text-xs font-medium text-gray-900 truncate">
                                 {safeFile.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                 {formatFileSize(safeFile.size)}
                              </p>
                           </div>
                        </div>
                     );
                  })}
               </div>

               {/* Clear All Button */}
               {value.length > 1 && (
                  <button
                     type="button"
                     onClick={() => onChange([])}
                     className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                     Clear all files
                  </button>
               )}
            </div>
         )}
      </div>
   );
};

export default FileUpload;