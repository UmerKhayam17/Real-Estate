// components/common/ImageWithFallback.jsx
'use client';

import React, { useState } from 'react';
import { FiHome } from 'react-icons/fi';

const ImageWithFallback = ({
   src,
   alt,
   fallbackComponent,
   className = '',
   ...props
}) => {
   const [hasError, setHasError] = useState(false);

   if (hasError || !src) {
      return fallbackComponent || (
         <div className={`w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${className}`}>
            <FiHome className="w-12 h-12 text-gray-400" />
            <span className="sr-only">No image available</span>
         </div>
      );
   }

   return (
      <img
         src={src}
         alt={alt}
         className={className}
         onError={() => setHasError(true)}
         {...props}
      />
   );
};

export default ImageWithFallback;