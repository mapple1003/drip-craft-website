export type ProductDoc = {
  id: string;
  name: string;
  description: string;
  flavor: string[];
  price: number;
  imageUrl: string;
  order: number;
  active: boolean;
  // English content (optional)
  nameEn?: string;
  descriptionEn?: string;
  flavorEn?: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type SiteContentHero = {
  heading: string;
  subheading: string;
  imageUrl?: string;
  updatedAt: Date;
};

export type StoryValue = {
  title: string;
  description: string;
};

export type SiteContentStory = {
  heading: string;
  body1: string;
  body2: string;
  imageUrl?: string;
  values?: StoryValue[];
  updatedAt: Date;
};

export type SiteContentSettings = {
  instagramHandle: string;
  instagramHeading?: string;
  instagramDescription?: string;
  updatedAt: Date;
};

export type SiteContentContact = {
  email: string;
  hours: string;
  hoursNote: string;
  location: string;
  description?: string;
  updatedAt: Date;
};

export type StoreDoc = {
  id: string;
  name: string;
  address: string;
  url?: string;
  note?: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SpotDoc = {
  id: string;
  name: string;
  description: string;
  nameEn?: string;
  descriptionEn?: string;
  nameZh?: string;
  descriptionZh?: string;
  nameKo?: string;
  descriptionKo?: string;
  imageUrl?: string;
  imageUrls?: string[];
  images?: { url: string; caption?: string }[];
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactDoc = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
};

export type EventDoc = {
  id: string;
  title: string;
  date: string;
  location: string;
  address?: string;
  description?: string;
  url?: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};
