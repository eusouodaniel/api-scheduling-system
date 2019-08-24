import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    fileName: (req, avatar, cb) => {
      crypto.randomBytes(20, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(avatar.originalname));
      });
    },
  }),
};
