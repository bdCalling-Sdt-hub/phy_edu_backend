/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
// fileUpload.ts
import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

export const handleChunkUpload = (req: Request, res: Response) => {
  const chunk = req.file;
  const { originalname, chunkIndex, totalChunks } = req.body;

  const uploadDir = path.join(process.cwd(), 'uploads/video');
  const filePath = path.join(uploadDir, originalname);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  fs.appendFileSync(filePath, fs.readFileSync(chunk?.path as string));

  fs.unlinkSync(chunk?.path as string);
  if (chunk) {
    if (Number(chunkIndex) + 1 === Number(totalChunks)) {
      return res.json({
        status: 'completed',
        message: 'File uploaded successfully!',
        videoUrl: `/uploads/video/${originalname}`,
      });
    } else {
      return res.json({ status: 'chunkReceived', message: 'Chunk received!' });
    }
  } else {
    return res
      .status(400)
      .json({ status: 'error', message: 'No chunk received' });
  }
};
