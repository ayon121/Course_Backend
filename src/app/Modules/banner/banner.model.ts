import { Schema, model } from 'mongoose';
import { IBanner } from './banner.interfcae';


const bannerSchema = new Schema<IBanner>(
  {
    photos: [
      {
        url: { type: String, required: true },
        link: { type: String, required: false },
      }
    ],
  },
  { timestamps: true }
);

export const Banner = model<IBanner>('Banner', bannerSchema);