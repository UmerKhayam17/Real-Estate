// data/propertiesData.js
export const temporaryProperties = [
   {
      _id: '1',
      title: 'Modern Apartment in DHA',
      description: 'Beautiful 3-bedroom apartment with modern amenities and great view',
      price: 45000000,
      currency: 'PKR',
      type: 'residential',
      saleOrRent: 'sale',
      status: 'available',
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      address: {
         street: 'Street 5, Phase 5',
         city: 'Karachi',
         state: 'Sindh',
         country: 'Pakistan',
         postalCode: '75500'
      },
      location: {
         type: 'Point',
         coordinates: [67.0011, 24.8607]
      },
      images: [
         '/api/placeholder/400/300',
         '/api/placeholder/400/300',
         '/api/placeholder/400/300'
      ],
      features: ['parking', 'air-conditioning', 'security', 'furnished'],
      views: 124,
      approved: true,
      createdAt: '2024-01-15'
   },
   {
      _id: '2',
      title: 'Luxury Villa in Bahria Town',
      description: 'Spacious 5-bedroom villa with swimming pool and garden',
      price: 85000000,
      currency: 'PKR',
      type: 'residential',
      saleOrRent: 'sale',
      status: 'available',
      bedrooms: 5,
      bathrooms: 4,
      area: 3500,
      address: {
         street: 'Block C, Phase 8',
         city: 'Lahore',
         state: 'Punjab',
         country: 'Pakistan',
         postalCode: '53720'
      },
      location: {
         type: 'Point',
         coordinates: [74.3587, 31.5204]
      },
      images: [
         '/api/placeholder/400/300',
         '/api/placeholder/400/300'
      ],
      features: ['parking', 'garden', 'pool', 'security', 'air-conditioning'],
      views: 89,
      approved: true,
      createdAt: '2024-01-10'
   },
   {
      _id: '3',
      title: 'Commercial Space in Clifton',
      description: 'Prime commercial space ideal for office or retail business',
      price: 120000000,
      currency: 'PKR',
      type: 'commercial',
      saleOrRent: 'sale',
      status: 'available',
      bedrooms: 0,
      bathrooms: 2,
      area: 2500,
      address: {
         street: 'Marine Drive, Block 2',
         city: 'Karachi',
         state: 'Sindh',
         country: 'Pakistan',
         postalCode: '75600'
      },
      location: {
         type: 'Point',
         coordinates: [67.0285, 24.8149]
      },
      images: [
         '/api/placeholder/400/300'
      ],
      features: ['parking', 'security', 'elevator'],
      views: 67,
      approved: true,
      createdAt: '2024-01-08'
   },
   {
      _id: '4',
      title: 'Cozy 2-Bed Apartment for Rent',
      description: 'Fully furnished apartment in heart of Islamabad with all utilities included',
      price: 85000,
      currency: 'PKR',
      type: 'residential',
      saleOrRent: 'rent',
      status: 'available',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      address: {
         street: 'Sector F-7',
         city: 'Islamabad',
         state: 'ICT',
         country: 'Pakistan',
         postalCode: '44000'
      },
      location: {
         type: 'Point',
         coordinates: [73.0479, 33.6844]
      },
      images: [
         '/api/placeholder/400/300',
         '/api/placeholder/400/300',
         '/api/placeholder/400/300'
      ],
      features: ['furnished', 'air-conditioning', 'heating', 'security'],
      views: 156,
      approved: true,
      createdAt: '2024-01-12'
   },
   {
      _id: '5',
      title: 'Industrial Warehouse',
      description: 'Large industrial warehouse with loading docks and office space',
      price: 65000000,
      currency: 'PKR',
      type: 'industrial',
      saleOrRent: 'sale',
      status: 'pending',
      bedrooms: 0,
      bathrooms: 1,
      area: 5000,
      address: {
         street: 'Industrial Area, Sector 7',
         city: 'Karachi',
         state: 'Sindh',
         country: 'Pakistan',
         postalCode: '75850'
      },
      location: {
         type: 'Point',
         coordinates: [67.1123, 24.9234]
      },
      images: [
         '/api/placeholder/400/300'
      ],
      features: ['parking', 'security'],
      views: 34,
      approved: false,
      createdAt: '2024-01-05'
   },
   {
      _id: '6',
      title: 'Beach View Penthouse',
      description: 'Luxurious penthouse with panoramic sea views and premium finishes',
      price: 95000000,
      currency: 'PKR',
      type: 'residential',
      saleOrRent: 'sale',
      status: 'available',
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      address: {
         street: 'Seaview Road, Phase 8',
         city: 'Karachi',
         state: 'Sindh',
         country: 'Pakistan',
         postalCode: '75600'
      },
      location: {
         type: 'Point',
         coordinates: [67.0456, 24.8123]
      },
      images: [
         '/api/placeholder/400/300',
         '/api/placeholder/400/300'
      ],
      features: ['parking', 'balcony', 'air-conditioning', 'security', 'furnished'],
      views: 201,
      approved: true,
      createdAt: '2024-01-18'
   }
];