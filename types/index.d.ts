/// <reference types="node" />
import { Express } from "express";
import http from "http";
import https from "https";
import { IRouterOptions } from "../types/router";
export default class {
    readonly app: Express;
    readonly port: number;
    readonly server: http.Server | https.Server;
    private terminator;
    constructor(port: number, options?: IRouterOptions);
    start(): void;
    close(): Promise<void>;
}
