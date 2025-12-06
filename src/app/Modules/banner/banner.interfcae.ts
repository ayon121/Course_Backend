export interface IBanner {
  _id?: string;
  photos: {
    url: string;       // The image path
    link?: string;     // Optional link for this banner
  }[];
}