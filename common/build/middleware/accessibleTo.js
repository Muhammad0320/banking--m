"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessibleTo = void 0;
const Forbidden_1 = require("../error/Forbidden");
const accessibleTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.currentUser.role)) {
            throw new Forbidden_1.Forbidden("You are not allowed to access this route");
        }
        next();
    };
};
exports.accessibleTo = accessibleTo;
