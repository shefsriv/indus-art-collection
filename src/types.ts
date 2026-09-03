export interface Work {
  id: string;
  /** How the painting is named in public — "IAC-001". No artist name is
   *  published; the reference is what an enquiry quotes. */
  ref: string;
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

export interface Catalog {
  /** How many painters are represented. Their names stay out of the website. */
  artistCount: number;
  /** Already in hanging order, arranged when the catalogue is built. */
  works: Work[];
}
