import db from "../database/db.js";
import bcryptjs from 'bcryptjs';
import appErrorInstance from "../util/AppError.js";

function validatorPassword(password) {
    const minCharacters = 3;
    const maxCharacters = 10;

    if (password) {
        if (password.length >= minCharacters && password.length <= maxCharacters)
            return { statusError: false, message: `Nome correto` };
        return { statusError: true, message: `A senha deve ter de ${minCharacters} até ${maxCharacters} caracteres` };
    }
    return { statusError: true, message: `Não foi informada uma senha` };
}

function validatorName(userName) {
    const minCharacters = 4;
    const maxCharacters = 20;

    if (userName) {
        if (userName.length >= minCharacters && userName.length <= maxCharacters)
            return { statusError: false, message: `Nome correto` };
        return { statusError: true, message: `O nome deve conter de ${minCharacters} até ${maxCharacters} caracteres` };
    }
    return { statusError: true, message: `Não foi informado um nome` };
}

function validatorEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (email && emailRegex.test(email)) {
        return { statusError: false, message: `Email correto` };
    }

    return { statusError: true, message: `O email informado não está em um padrão válido` };
}

async function getAllUsers() {
    const querySelect = `SELECT * 
                         FROM users`;

    try {
        const data = await new Promise((resolve, reject) => {
            db.query(querySelect, (error, data) => {
                if (error)
                    reject(error);
                resolve(data);
            });
        });

        return data;
    } catch (error) {
        appErrorInstance.throwError(res, error.message);
    }
}

async function getUserById(id = 0) {
    const query = "SELECT * FROM users WHERE id = ?";

    const user = await new Promise((resolve, reject) => {
        db.query(query, [id], (error, data) => {
            if (error)
                reject(error);
            resolve(data);
        });
    });

    return user[0];
}

async function createUser({ user }) {
    const queryInsert = `INSERT INTO users 
                            (name, email, password)
                            values(?, ?, ?)
                        `;
    const validName = validatorName(user.name);
    const validEmail = validatorEmail(user.email);
    const validPassword = validatorPassword(user.password);

    try {
        if (validName.statusError)
            throw new Error(validName.message);
        if (validEmail.statusError)
            throw new Error(validEmail.message);
        if (validPassword.statusError)
            throw new Error(validPassword.message);

        const hashedPassword = bcryptjs.hashSync(user.password, 8);
        const values = [user.name, user.email, hashedPassword];

        const data = await new Promise((resolve, reject) => {
            db.query(queryInsert, values, (error, data) => {
                if (error)
                    reject(error);
                resolve(data);
            });
        });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function updateUser({ user }) {
    const queryUpdate = `   UPDATE users 
                            SET name = ?, email = ?, password = ?, updated_at = ?
                            WHERE id = ?`;
    const { id, name, email, password, old_password } = user;

    try {
        if (!id)
            throw new Error(`O valor ${id} não é valido para ID`);

        const userTmp = await getUserById(id);

        if (!userTmp)
            throw new Error(`O usuário não foi encontrado`);

        if (!name && !email && !password)
            throw new Error(`Algum parametro de atualização precisa ser informado!`);

        const validName = validatorName(name);

        if (validName.statusError)
            throw new Error(validName.message);
        userTmp.name = name;

        const validEmail = validatorEmail(email);

        if (validEmail.statusError)
            throw new Error(validEmail.message);
        userTmp.email = email;

        if (password && old_password) {
            const validPassword = validatorPassword(password);
            const validOldPassword = validatorPassword(old_password);

            if (validPassword.statusError)
                throw new Error(validPassword.message);
            if (validOldPassword.statusError)
                throw new Error(validOldPassword.message);
            if (!(await bcryptjs.compare(old_password, user.password)))
                throw new Error(`A senha anterior não confere com a informada`);

            user.password = bcryptjs.hashSync(password, 8);
        }

        const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const values = [userTmp.name, userTmp.email, userTmp.password, formattedDate, id];
        const response = await new Promise((resolve, reject) => {
            db.query(queryUpdate, values, (error, data) => {
                if (error)
                    reject(error);
                resolve(data);
            });
        });

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function deleteUser(id = 0) {
    const queryDelete = `DELETE FROM users 
                         WHERE id = ?`;

    try {
        if (!id)
            throw new Error(`O valor ${id} não é valido para ID`);
        if (!(await getUserById(id)))
            throw new Error(`O usuário não foi encontrado`);

        const data = await new Promise((resolve, reject) => {
            db.query(queryDelete, [id], (error, data) => {
                if (error)
                    reject(error);
                resolve(data);
            });
        });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};