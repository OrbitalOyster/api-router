Simple express-based router.

# Installation

```bash
npm install @orbitaloyster/api-router
```

# Usage

```ts
import ApiRouter from "@orbitaloyster/api-router";
const apiRouter = new ApiRouter(8080);
apiRouter.app.get("/hello", (_req, res) => res.send("Hello, World!"));
apiRouter.start();
/* Some code */
await apiRouter.close();
```
