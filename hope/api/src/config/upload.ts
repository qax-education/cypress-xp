import multer from 'multer';
import path from 'path';

export default {
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename: (request, file, cb) => {
      if ((process.env.NODE_ENV || '').trim() === 'production') {
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename);
      } else {
        const filename = file.originalname
        cb(null, filename);
      }
    }
  })
};
