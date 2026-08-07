export interface Work {
  id: string;
  artist: string;
  artistSlug: string;
  style: string;
  title: string;
  size: string;
  medium: string;
  year: string;
  ref: string;
  description: string;
  aspect: number;
  thumb: string;
  full: string;
}

export interface Artist {
  slug: string;
  name: string;
  style: string;
  bio: string;
  count: number;
  cover: string;
}

export interface Catalog {
  artists: Artist[];
  works: Work[];
}
