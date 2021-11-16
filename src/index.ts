import express, { Express, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import fs from "fs";
import http from "http";
import httpTerminator, { HttpTerminator } from "http-terminator";
import https from "https";
import { IRouterOptions } from "../types/router";

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
    this.app.use((req, _res, next) => {
      console.log(`${req.method} request for "${req.url}" from ${req.ip}`);
      next();
    });
  }

  start(): void {
    console.log("Starting the server...");
    this.app.use((_req: Request, res: Response) => res.sendStatus(404));
    this.app.use(
      /* On error. Handler requires 4 arguments, but since _next is unused, eslint warning must be suppressed */
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        /* Errors thrown from here go directly to browser */
        console.log("Internal server error", err);
        if (!res.headersSent) res.sendStatus(500);
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
