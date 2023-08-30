import path from "path";
import multer from "multer";
import crypto from "crypto";

const TMP_FOLDER = path.resolve("/Users/wagnerpassos/Documents/dev/api-movies/src/", "tmp");
const UPLOAD_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const MULTER = {
    storage: multer.diskStorage({
        destination: TMP_FOLDER,
        filename(request, file, callback){
            const fileHash =  crypto.randomBytes(10).toString("Hex");
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
        }
    })
};

export {
    TMP_FOLDER,
    UPLOAD_FOLDER,
    MULTER
}