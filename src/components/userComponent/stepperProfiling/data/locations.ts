export interface Province {
  name: string;
  cities: string[];
}

export interface Country {
  code: string;
  name: string;
  provinces: Province[];
}

// Dummy data. Replace with the locations API later.
export const COUNTRIES: Country[] = [
  {
    code: "id",
    name: "Indonesia",
    provinces: [
      { name: "DKI Jakarta", cities: ["Jakarta Selatan", "Jakarta Pusat", "Jakarta Barat"] },
      { name: "Jawa Barat", cities: ["Bandung", "Bekasi", "Bogor"] },
      { name: "Jawa Timur", cities: ["Surabaya", "Malang"] },
      { name: "DI Yogyakarta", cities: ["Yogyakarta", "Sleman"] },
      { name: "Bali", cities: ["Denpasar", "Badung"] },
    ],
  },
  {
    code: "sg",
    name: "Singapore",
    provinces: [
      { name: "Central Region", cities: ["Singapore"] },
      { name: "East Region", cities: ["Tampines", "Bedok"] },
    ],
  },
  {
    code: "my",
    name: "Malaysia",
    provinces: [
      { name: "Kuala Lumpur", cities: ["Kuala Lumpur"] },
      { name: "Selangor", cities: ["Shah Alam", "Petaling Jaya"] },
      { name: "Penang", cities: ["George Town"] },
    ],
  },
  {
    code: "jp",
    name: "Japan",
    provinces: [
      { name: "Tokyo", cities: ["Shibuya", "Shinjuku"] },
      { name: "Osaka", cities: ["Osaka", "Sakai"] },
    ],
  },
  {
    code: "kr",
    name: "South Korea",
    provinces: [
      { name: "Seoul", cities: ["Gangnam", "Mapo"] },
      { name: "Busan", cities: ["Haeundae"] },
    ],
  },
  {
    code: "us",
    name: "United States",
    provinces: [
      { name: "California", cities: ["Los Angeles", "San Francisco"] },
      { name: "New York", cities: ["New York City", "Buffalo"] },
    ],
  },
  {
    code: "gb",
    name: "United Kingdom",
    provinces: [
      { name: "England", cities: ["London", "Manchester"] },
      { name: "Scotland", cities: ["Edinburgh", "Glasgow"] },
    ],
  },
];
