import Multer, { Options, FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import crypto from "crypto";

const FILES_MAX_SIZE = 5 * 1024 * 1024; // 5MB

const DIRECTORY = path.join(__dirname, '..', '..', 'uploads');

export default {
  storage: Multer.diskStorage({
    destination: DIRECTORY,
    filename: (request: Request, file: Express.Multer.File, callback: any) => {
      crypto.randomBytes(16, (error, hash) => {
        callback(null, `${hash.toString("hex")}-${file.originalname}`);
      })
    },
  }),
  limits: {
    fileSize: FILES_MAX_SIZE,
  },
  fileFilter: (request: Request, file: Express.Multer.File , callback: FileFilterCallback) => {
    const mimeTypes = [
      "image/jpeg",
      "image/png",
    ];

    if (!mimeTypes.includes(file.mimetype)) {
      return callback(null, false);
    }

    callback(null, true);
  },
} as Options;