import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";

import { shortenUrl, getUrl } from "#controllers/url.controller.js";
import { createSchema, getUrlSchema } from "#schemas/url.schema.js";
import { createShortenUrl, getOriginalUrl } from "#services/url.service.js";

// Mock modules
vi.mock("#schemas/url.schema.js", () => ({
  createSchema: { validate: vi.fn() },
  getUrlSchema: { validate: vi.fn() },
}));

vi.mock("#services/url.service.js", () => ({
  createShortenUrl: vi.fn(),
  getOriginalUrl: vi.fn(),
}));

// Get typed mocks
const mockedCreateSchema = vi.mocked(createSchema);
const mockedCreateService = vi.mocked(createShortenUrl);
const mockedGetSchema = vi.mocked(getUrlSchema);
const mockedGetService = vi.mocked(getOriginalUrl);

describe("shortenUrl controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: { originalUrl: "https://example.com" } };
    res = { send: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn() };
    next = vi.fn();
  });

  describe("POST - shortenUrl API", () => {
    it("should validate input, create short URL, and return response", async () => {
      mockedCreateSchema.validate.mockResolvedValue({
        originalUrl: "https://example.com",
      });
      mockedCreateService.mockResolvedValue({
        originalUrl: "https://example.com",
        shortCode: "abc123",
      });

      await shortenUrl(req as Request, res as Response, next);

      expect(mockedCreateSchema.validate).toHaveBeenCalledWith(req.body);
      expect(mockedCreateService).toHaveBeenCalledWith("https://example.com");
      expect(res.send).toHaveBeenCalledWith({
        originalUrl: "https://example.com",
        shortCode: "abc123",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next on validation error", async () => {
      const error = new Error("Invalid URL");
      mockedCreateSchema.validate.mockRejectedValue(error);

      await shortenUrl(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should call next on service error", async () => {
      mockedCreateSchema.validate.mockResolvedValue({
        originalUrl: "https://example.com",
      });
      const serviceError = new Error("Service failed");
      mockedCreateService.mockRejectedValue(serviceError);

      await shortenUrl(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(serviceError);
    });
  });

  describe("GET - getUrl API", () => {
    it("should validate input, get original URL, and return response", async () => {
      mockedGetSchema.validate.mockResolvedValue({
        shortCode: "short123",
      });
      mockedGetService.mockResolvedValue({
        originalUrl: "https://example.com",
      });

      await getUrl(req as Request, res as Response, next);

      expect(mockedGetSchema.validate).toHaveBeenCalledWith(req.params);
      expect(mockedGetService).toHaveBeenCalledWith("short123");
      expect(res.send).toHaveBeenCalledWith({
        originalUrl: "https://example.com",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 404 error if not found", async () => {
      mockedGetSchema.validate.mockResolvedValue({
        shortCode: "short123",
      });

      mockedGetService.mockResolvedValue({});

      await getUrl(req as Request, res as Response, next);

      expect(mockedGetSchema.validate).toHaveBeenCalledWith(req.params);
      expect(mockedGetService).toHaveBeenCalledWith("short123");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not found",
        success: false,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next on validation error", async () => {
      const error = new Error("Invalid URL");
      mockedGetSchema.validate.mockRejectedValue(error);

      await getUrl(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should call next on service error", async () => {
      mockedGetSchema.validate.mockResolvedValue({
        shortCode: "short123",
      });
      const serviceError = new Error("Service failed");
      mockedGetService.mockRejectedValue(serviceError);

      await shortenUrl(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(serviceError);
    });
  });
});
