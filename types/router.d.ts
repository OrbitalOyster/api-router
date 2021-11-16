export interface IRouterOptions {
  cookieSecret?: string;
  privateKeyPath?: string;
  certificatePath?: string;
}

export { Request, Response, NextFunction } from "express";
