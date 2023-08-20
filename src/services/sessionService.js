import db from "../database/db.js";

async function getUserByEmail(email) {
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

export { getUserByEmail };