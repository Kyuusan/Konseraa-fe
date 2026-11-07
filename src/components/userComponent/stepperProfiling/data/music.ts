export interface Genre {
  id: string;
  label: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
}

// Dummy data. Replace with the catalogue API later.
export const GENRES: Genre[] = [
  { id: "pop", label: "Pop" },
  { id: "rock", label: "Rock" },
  { id: "indie", label: "Indie" },
  { id: "hiphop", label: "Hip-Hop" },
  { id: "rnb", label: "R&B" },
  { id: "edm", label: "EDM" },
  { id: "kpop", label: "K-Pop" },
  { id: "jazz", label: "Jazz" },
  { id: "metal", label: "Metal" },
  { id: "dangdut", label: "Dangdut" },
];

const PHOTOS = [
  "photo-1514525253161-7a46d19cd819",
  "photo-1506157786151-b8491531f063",
  "photo-1470225620780-dba8ba36b745",
  "photo-1459749411175-04bf5292ceea",
  "photo-1540039155733-5bb30b53aa14",
  "photo-1501386761578-eac5c94b800a",
  "photo-1516450360452-9312f5e86fc7",
  "photo-1470229722913-7c0e2dbbafd3",
  "photo-1501281668745-f7f57925c3b4",
];

const photo = (index: number) =>
  `https://images.unsplash.com/${PHOTOS[index % PHOTOS.length]}?q=80&w=600&auto=format&fit=crop`;

const ARTIST_LIST: [name: string, genre: string][] = [
  ["The Weeknd", "rnb"],
  ["Coldplay", "rock"],
  ["Billie Eilish", "pop"],
  ["Arctic Monkeys", "indie"],
  ["Travis Scott", "hiphop"],
  ["BLACKPINK", "kpop"],
  ["Martin Garrix", "edm"],
  ["Tulus", "pop"],
  ["Hindia", "indie"],
  ["SZA", "rnb"],
  ["Kendrick Lamar", "hiphop"],
  ["NewJeans", "kpop"],
  ["Calvin Harris", "edm"],
  ["Metallica", "metal"],
  ["Norah Jones", "jazz"],
  ["Rhoma Irama", "dangdut"],
  ["Bruno Mars", "pop"],
  ["Foo Fighters", "rock"],
];

export const ARTISTS: Artist[] = ARTIST_LIST.map(([name, genre], index) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  genre,
  image: photo(index),
}));
