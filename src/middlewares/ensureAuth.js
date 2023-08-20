
import appErrorInstance from "../util/AppError.js";
import { jwt } from "../configs/auth.js";
import pkg from 'jsonwebtoken';
const { verify } = pkg;

export function ensureAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    try {
        if (!authHeader)
            throw new Error("Token não estabecido!");

        const [, token] = authHeader.split(" ");
        const { sub: user_id } = verify(token, jwt.secret);

        req.user = {
            id: Number(user_id)
        };
        return next();
    } catch (error) {
        appErrorInstance.throwError(res, error.message);
    }
}
