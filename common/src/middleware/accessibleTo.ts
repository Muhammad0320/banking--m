import { NextFunction, Request, Response } from "express";
import { UserRole } from "../enums/UserRoles";
import { Forbidden } from "../error/Forbidden";

export const accessibleTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.currentUser.role)) {
      throw new Forbidden("You are not allowed to access this route");
    }

    next();
  };
};
