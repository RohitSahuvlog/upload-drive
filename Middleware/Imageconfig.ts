import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },

    filename: function (req: any, file: any, cb: any) {
      const uniqueprefix = Date.now();
    cb(null, uniqueprefix+"-"+file.originalname);
  },
});

export default storage;
