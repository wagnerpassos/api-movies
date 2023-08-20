import appErrorInstance from "../util/AppError.js";
import bcryptjs from "bcryptjs";
import pkg from 'jsonwebtoken';
import { jwt } from "../configs/auth.js"; 
import { getUserByEmail } from "../services/sessionService.js";

class SessionsController {
    async create(req, res){
        const { email, password } = req.body;
        const { sign } = pkg;
    
        try {
            if(!email || !password){
                throw new Error("Os campos de email e senha devem conter dados!");
            }

            const user = await getUserByEmail(email);

            if(!user || (user && !user)){
                throw new Error("Usuário ou senha inválida");
            }
    
            const passwordMatch = await bcryptjs.compare(password, user.password);
    
            if((password && !passwordMatch)){
                throw new Error("Usuário ou senha inválida");
            }

            const { secret, expiresIn } = jwt;
            const token = sign({}, secret, {
                subject: String(user.id),
                expiresIn
            })

            res.json({user, token});
        } catch(error) {
            appErrorInstance.throwError(res, error.message);
        }
    }
}

export default SessionsController;