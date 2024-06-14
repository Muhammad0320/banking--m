import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserStatus } from "../enums/UserStatus";
import { UserRole } from "../enums/UserRoles";

interface UserPayload {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string;
  createdAt: Date;
  status: UserStatus;
  passwordConfirm: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) return next();

  const user = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;

  req.currentUser = user;

  next();
};
