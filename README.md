Simple express-based router.

# Installation

```bash
npm install @orbitaloyster/api-router
```

# Usage

```ts
import Router from "@orbitaloyster/api-router";
const router = new Router(8080);
router.start();
await router.close();
```
