/* eslint-disable @typescript-eslint/no-explicit-any, react-refresh/only-export-components, @typescript-eslint/no-require-imports, prefer-const */
export interface DeliveryZone {
  area: string;
  pincode: string;
  category: string;
  notes: string;
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  { area: "Patancheru", pincode: "502319", category: "Core Supply Zone", notes: "Near farm base" },
  { area: "Lingampally", pincode: "500019", category: "Secondary", notes: "Transit/residential" },
  { area: "Nanakramguda", pincode: "500032", category: "Premium", notes: "Corporate + apartments" },
  { area: "Financial District", pincode: "500032", category: "Premium", notes: "High-income IT zone" },
  { area: "Gachibowli", pincode: "500032", category: "Premium", notes: "Strong premium demand" },
  { area: "Manikonda", pincode: "500089", category: "Premium", notes: "Large apartment clusters" },
  { area: "Gandipet", pincode: "500075", category: "Premium", notes: "Villa/residential growth" },
  { area: "Jubilee Hills", pincode: "500033", category: "Premium", notes: "Upscale residential" },
  { area: "Banjara Hills", pincode: "500034", category: "Premium", notes: "Upscale residential" },
  { area: "Madhapur", pincode: "500081", category: "Premium", notes: "IT + apartments" },
  { area: "Kondapur", pincode: "500084", category: "Premium", notes: "High recurring demand" },
  { area: "Nallagandla", pincode: "500019", category: "Non-Premium Growth", notes: "Educated families" },
  { area: "Tellapur", pincode: "502032", category: "Growth Corridor", notes: "Emerging premium" },
  { area: "Osman Nagar", pincode: "502300", category: "Growth Corridor", notes: "Developing" },
  { area: "Kollur", pincode: "502300", category: "Growth Corridor", notes: "Future expansion" }
];

export const isDeliverable = (addressData: { address: any }): boolean => {
  if (!addressData || !addressData.address) return false;
  
  const addr = addressData.address;
  const pincode = addr.postcode;
  
  // Create an array of possible area names from the Nominatim response
  const localAreas = [
    addr.neighbourhood,
    addr.suburb,
    addr.village,
    addr.town,
    addr.city_district,
    addr.county
  ].filter(Boolean).map(a => a.toLowerCase());

  // Check if pincode matches any zone
  const byPincode = DELIVERY_ZONES.find(z => z.pincode === pincode);
  if (byPincode) return true;

  // Check if any local area matches our delivery areas
  const byArea = DELIVERY_ZONES.find(z => 
    localAreas.some(local => local.includes(z.area.toLowerCase()) || z.area.toLowerCase().includes(local))
  );
  
  return !!byArea;
};
