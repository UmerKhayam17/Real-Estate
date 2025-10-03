// utils/imageUtils.js
export const getImageUrl = (imagePath) => {
   if (!imagePath) return null;

   // If it's already a full URL, return as is
   if (imagePath.startsWith('http')) {
      return imagePath;
   }

   // If it's a relative path, prepend backend URL
   const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

   // Ensure the path starts with a slash
   const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

   return `${backendUrl}${normalizedPath}`;
};

export const getPropertyImageUrl = (property, index = 0) => {
   if (!property?.media || property.media.length === 0) {
      return null;
   }

   const mediaItem = property.media[index] || property.media[0];
   return getImageUrl(mediaItem?.url);
};