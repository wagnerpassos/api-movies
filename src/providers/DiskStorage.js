import fs from "fs";
import path from "path";
import { UPLOAD_FOLDER, TMP_FOLDER, MULTER } from "../configs/upload";

class DiskStorage {
    async saveFile(file){
        await fs.promises.rename(
            path.resolve(TMP_FOLDER, file),
            path.resolve(UPLOAD_FOLDER, file)
        );

        return file;
    }

    async deleteFile(file){
        const filePath = path.resolve(UPLOAD_FOLDER, file);

        try {
            await fs.promises.stat(filePath); 
        } catch (error) {
            return;
        }

        await fs.promises.unlink(filePath);
    }
}

export { DiskStorage };