let instance;

class AppError {
    constructor () {
        if (instance) {
            throw new Error("New instance cannot be created!!");
        }

        instance = this;
    }

    throwError(response, message, statusCode = 400) {
        response.send({message, statusCode});
    }
}

let appErrorInstance = Object.freeze(new AppError());

export default appErrorInstance;
