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

export type SiteContentStory = {
  heading: string;
  body1: string;
  body2: string;
  updatedAt: Date;
};

export type SiteContentContact = {
  email: string;
  hours: string;
  hoursNote: string;
  location: string;
  updatedAt: Date;
};

export type ContactDoc = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
};
