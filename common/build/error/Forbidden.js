"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forbidden = void 0;
const CustomError_1 = require("./CustomError");
class Forbidden extends CustomError_1.CustomError {
    constructor(message) {
        super();
        this.message = message;
        this.statusCode = 403;
        Object.setPrototypeOf(this, Forbidden.prototype);
    }
    serializeError() {
        return [{ message: this.message }];
    }
}
exports.Forbidden = Forbidden;
