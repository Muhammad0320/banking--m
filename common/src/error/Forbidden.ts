import { CustomError } from "./CustomError";

export class Forbidden extends CustomError {
  statusCode = 403;

  constructor(public message: string) {
    super();

    Object.setPrototypeOf(this, Forbidden.prototype);
  }

  serializeError() {
    return [{ message: this.message }];
  }
}
