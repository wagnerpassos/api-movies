import path from "path";
import multer from "multer";
import crypto from "crypto";

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOAD_FOLDER = path.resolve(__dirname, "uploads");

const MULTER = {
    storage: multer.diskStorage({
        destination: TMP_FOLDER,
        filename(request, file, callback){
            const fileHash =  crypto.randomBytes(10).toString("Hex");
            const fileName = `${fileHash}-file.orginalName`;

            return callback(null, fileName);
        }
    })
};

export {
    TMP_FOLDER,
    UPLOAD_FOLDER,
    MULTER
}