declare module "router" {
  export interface IRouterOptions {
    cookieSecret?: string;
    privateKeyPath?: string;
    certificatePath?: string;
  }

  export { Express, Request, Response, NextFunction } from "express";
}
