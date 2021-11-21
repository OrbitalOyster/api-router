import express, { Express, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import http from "node:http";
import httpTerminator, { HttpTerminator } from "http-terminator";
import https from "node:https";
import { IRouterOptions } from "router";

export default class {
  /* Express app */
  readonly app: Express;
  /* HTTP port */
  readonly port: number;
  /* Server */
  readonly server: http.Server | https.Server;
  /* Graceful http server terminator */
  private terminator: HttpTerminator;
  constructor(port: number, options?: IRouterOptions) {
    const { privateKeyPath, certificatePath, cookieSecret } = { ...options };
    /* Set port */
    this.port = port;
    /* Create express app  */
    this.app = express();
    /* HTTP or HTTPS Server  */
    if (privateKeyPath && certificatePath) {
      const credentials = {
        key: fs.readFileSync(privateKeyPath),
        cert: fs.readFileSync(certificatePath),
      };
      this.server = https.createServer(credentials, this.app);
    } else this.server = http.createServer(this.app);
    /* Set graceful termination */
    this.terminator = httpTerminator.createHttpTerminator({
      server: this.server,
    });
    /* Enable body parser for POST requests */
    this.app.use(express.json());
    /* Enable cookies */
    cookieSecret && this.app.use(cookieParser(cookieSecret));
    /* On every request */
    this.app.use((request, _response, next) => {
      console.log(
        `${request.method} request for "${request.url}" from ${request.ip}`
      );
      next();
    });
  }

  start(): void {
    console.log("Starting the server...");
    this.app.use((_request: Request, response: Response) =>
      response.sendStatus(404)
    );
    /* On error. Handler requires 4 arguments, but since _next is unused, eslint warning must be suppressed */
    this.app.use(
      (
        error: Error,
        _request: Request,
        response: Response,
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        _next: NextFunction
      ) => {
        /* Errors thrown from here go directly to browser */
        console.log("Internal server error", error);
        if (!response.headersSent) response.sendStatus(500);
      }
    );
    /* Start server */
    this.server.listen(this.port, () =>
      console.log(`Server is running on port ${this.port}`)
    );
  }

  async close(): Promise<void> {
    console.log("Closing the server...");
    await this.terminator.terminate();
  }
}
