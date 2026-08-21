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
  /** Painted in a single pigment — these hang before the coloured works. */
  mono: boolean;
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
