// components/property/LocationPicker.js
'use client'
import React, { useState } from 'react';
import { InputField } from '@/app/components/common/FormFields';

const LocationPicker = ({ coordinates, onChange }) => {
   const [lng, lat] = coordinates;

   const handleCoordinateChange = (index, value) => {
      const newCoordinates = [...coordinates];
      newCoordinates[index] = Number(value) || 0;
      onChange(newCoordinates);
   };

   return (
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
         <h3 className="text-lg font-medium text-gray-900">Location Coordinates</h3>
         <p className="text-sm text-gray-500">
            Enter the geographic coordinates for the property (Longitude, Latitude)
         </p>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
               name="longitude"
               label="Longitude"
               type="number"
               step="any"
               value={lng}
               onChange={(e) => handleCoordinateChange(0, e.target.value)}
               placeholder="Enter longitude"
               helperText="e.g., 67.0011 for Karachi"
               icon="number"
            />

            <InputField
               name="latitude"
               label="Latitude"
               type="number"
               step="any"
               value={lat}
               onChange={(e) => handleCoordinateChange(1, e.target.value)}
               placeholder="Enter latitude"
               helperText="e.g., 24.8607 for Karachi"
               icon="number"
            />
         </div>

         {lng !== 0 && lat !== 0 && (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
               Coordinates set: {lng}, {lat}
            </div>
         )}
      </div>
   );
};

export default LocationPicker;