import { NextFunction, Request, Response } from "express";
import { UserRole } from "../enums/UserRoles";
export declare const accessibleTo: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
