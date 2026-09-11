export interface Work {
  id: string;
  /** How the painting is named in an enquiry — "IAC-001". */
  ref: string;
  /** The painter's name, shown above the painting. */
  artist: string;
  /** Address of the painter's page: "#/artist/" + artistId. */
  artistId: string;
  style: string;
  title: string;
  size: string;
  medium: string;
  year: string;
  description: string;
  /** Painted in a single pigment — these hang before the coloured works. */
  mono: boolean;
  aspect: number;
  thumb: string;
  full: string;
}

export interface Artist {
  id: string;
  name: string;
  style: string;
  bio: string;
  /** How many of their paintings are in the collection. */
  count: number;
}

export interface Catalog {
  /** How many painters are represented. */
  artistCount: number;
  /** The painters, in hanging order, for the Meet the Artists page. */
  artists: Artist[];
  /** Already in hanging order, arranged when the catalogue is built. */
  works: Work[];
}
