/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import multer from 'multer';
import fs from 'fs';
export const uploadFile = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath = '';

      if (file.fieldname === 'profile_image') {
        uploadPath = 'uploads/images/profile';
      } else if (file.fieldname === 'thumbnail_image') {
        uploadPath = 'uploads/images/thumbnail_image';
      } else if (file.fieldname === 'article_images') {
        uploadPath = 'uploads/images/article_images';
      } else if (file.fieldname === 'video') {
        uploadPath = 'uploads/video';
      } else if (file.fieldname === 'category_image') {
        uploadPath = 'uploads/images/category_images';
      } else {
        uploadPath = 'uploads';
      }

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'video/mp4'
      ) {
        cb(null, uploadPath);
      } else {
        //@ts-ignore
        cb(new Error('Invalid file type'));
      }
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);
    },
  });

  const fileFilter = (req: Request, file: any, cb: any) => {
    const allowedFieldnames = [
      'image',
      'profile_image',
      'thumbnail_image',
      'article_images',
      'category_image',
      'video',
    ];

    if (file.fieldname === undefined) {
      // Allow requests without any files
      cb(null, true);
    } else if (allowedFieldnames.includes(file.fieldname)) {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'video/mp4'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'));
      }
    } else {
      cb(new Error('Invalid fieldname'));
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'profile_image', maxCount: 1 },
    { name: 'thumbnail_image', maxCount: 1 },
    { name: 'article_images', maxCount: 5 },
    { name: 'category_image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]);

  return upload;
};
