import { Request, Response, NextFunction } from "express";

import { createSchema, getUrlSchema } from "#schemas/url.schema.js";
import { createShortenUrl, getOriginalUrl } from "#services/url.service.js";

const shortenUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = await createSchema.validate(req.body);

    const newUrl = await createShortenUrl(validated.originalUrl);
    res.send({
      originalUrl: newUrl?.originalUrl,
      shortCode: newUrl?.shortCode,
    });
  } catch (err: unknown) {
    next(err);
  }
};

const getUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = await getUrlSchema.validate(req.params);
    const url = await getOriginalUrl(validated.shortCode);

    if (!url?.originalUrl) {
      return res.status(404).json({
        message: "Not found",
        success: false,
      });
    }

    res.send({
      originalUrl: url?.originalUrl,
    });
  } catch (err: unknown) {
    next(err);
  }
};

export { shortenUrl, getUrl };
