import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";

const app = new Hono();
app.use(logger());
app.get(
  "/pokemon-data",
  serveStatic({ root: "data", path: "pokemon_data.json" }),
);
app.get("/:type?", serveStatic({ root: "public", path: "index.html" }));
app.get("*", serveStatic({ root: "public" }));

Deno.serve({ port: 8000 }, app.fetch);
