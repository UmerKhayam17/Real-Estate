// utils/imageUtils.js
export const getImageUrl = (imagePath) => {
   if (!imagePath) return null;

   // If it's already a full URL, return as is
   if (imagePath.startsWith('http')) {
      return imagePath;
   }

   // For uploads, use the backend base URL directly
   const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

   // Ensure the path starts with a slash
   const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

   const fullUrl = `${backendBaseUrl}${normalizedPath}`;

   return fullUrl;
};

export const getPropertyImageUrl = (property, index = 0) => {
   if (!property?.media || property.media.length === 0) {
      return null;
   }
   //  Try to get the main image first, then fallback to index
   const mainImage = property.media.find(media => media.isMain);
   const mediaItem = mainImage || property.media[index] || property.media[0];

   return getImageUrl(mediaItem?.url);
};