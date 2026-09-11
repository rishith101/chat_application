import multer from "multer";

const MAX_FILE_SIZE = 30 * 1024 * 1024;

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        const isImg = file.mimetype.startsWith("image/");
        const isVid = file.mimetype.startsWith("video/");
        if (!isImg && !isVid) {
            cb(new Error("only images and video uploads are allowed"));
            return;

        }
        cb(null, true);
    },
});