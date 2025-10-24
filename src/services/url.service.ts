import { WhereOptions } from "sequelize";
import { nanoid } from "nanoid";

import { Url } from "#models/index.js";

const createShortenUrl = async (
  originalUrl: string,
): Promise<Partial<Url | null>> => {
  const shortCode = nanoid(6);
  const result = await Url.create({
    shortCode: shortCode,
    originalUrl: originalUrl,
  });

  return result;
};

const getOriginalUrl = async (
  shortCode: string,
): Promise<Partial<Url | null>> => {
  const condition: WhereOptions<Url> = {
    shortCode: shortCode,
  };

  const url = await Url.findOne({
    where: condition,
    order: [["createdAt", "DESC"]],
  });

  return url;
};

export { createShortenUrl, getOriginalUrl };
