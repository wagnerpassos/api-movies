import { updateUserAvatar } from "../services/userservice.js";
import appErrorInstance from "../util/AppError.js";

class UserAvatarController {
    async update(req, res) {
        const avatar = req.file.filename;
        const { id } = req.params;

        try {
            const response = updateUserAvatar({user:{avatar, id}})

            res.json(response);
        } catch (error) {
            appErrorInstance.throwError(res, error.message);
        }
    }
}

export default UserAvatarController;