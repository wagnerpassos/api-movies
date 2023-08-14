import db from "../database/db.js";
import appErrorInstance from "../util/AppError.js";
import bcryptjs from "bcryptjs";
import pkg from 'jsonwebtoken';
import { jwt } from "../configs/auth.js"; 

class SessionsController {
    constructor() {
        this.create = this.create.bind(this);
    }

    async create(req, res){
        const { email, password } = req.body;
        const { sign } = pkg;
    
        try {
            const user = await this.getUserByEmail(email);

            if(user && !user){
                throw new Error("Usuário ou senha inválida");
            }
    
            const passwordMatch = await bcryptjs.compare(password, user.password);
    
            if(password && !passwordMatch){
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

    async getUserByEmail(email) {
        const query = "SELECT * FROM users WHERE email = ?";
    
        const user = await new Promise((resolve, reject) => {
            db.query(query, [email], (error, data) => {
                if (error)
                    reject(error);
                resolve(data);
            });
        });
    
        return user[0];
    }
}

export default SessionsController;