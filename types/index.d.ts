import { Express } from "express";
import http from "node:http";
import https from "node:https";
import { IRouterOptions } from "router";
export default class {
    readonly app: Express;
    readonly port: number;
    readonly server: http.Server | https.Server;
    private terminator;
    constructor(port: number, options?: IRouterOptions);
    start(): void;
    close(): Promise<void>;
}
