import { Express } from "express";
import http from "node:http";
import https from "node:https";

export interface IRouterOptions {
    cookieSecret?: string;
    privateKeyPath?: string;
    certificatePath?: string;
}

export default class {
    readonly app: Express;
    readonly port: number;
    readonly server: http.Server | https.Server;
    private terminator;
    constructor(port: number, options?: IRouterOptions);
    start(): void;
    close(): Promise<void>;
}
