/* eslint-disable no-console */
// controllers/bannerController.ts
import { Request, Response } from "express";
import { Banner } from "./banner.model";


export const getBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findOne().lean();
    if (!banner) {
      return res.status(404).json({ message: "No banner found" });
    }
    res.json(banner);
  } catch (err) {
    console.error("getBanner error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const upsertBanner = async (req: Request, res: Response) => {
  try {
    const { photos } = req.body as { photos: { url: string; link?: string }[] };

    if (!Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({ message: "photos must be non-empty array" });
    }
    if (photos.length > 4) {
      return res.status(400).json({ message: "You can provide maximum 4 banners" });
    }

    // find existing banner doc
    let banner = await Banner.findOne();

    if (banner) {
      // update existing
      banner.photos = photos;
      await banner.save();
    } else {
      // create new
      banner = new Banner({ photos });
      await banner.save();
    }

    res.json(banner);
  } catch (err) {
    console.error("upsertBanner error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
