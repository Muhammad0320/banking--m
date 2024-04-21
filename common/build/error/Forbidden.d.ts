import { CustomError } from "./CustomError";
export declare class Forbidden extends CustomError {
    message: string;
    statusCode: number;
    constructor(message: string);
    serializeError(): {
        message: string;
    }[];
}
