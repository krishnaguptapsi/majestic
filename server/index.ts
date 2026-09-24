import "reflect-metadata";
import { createYoga } from "graphql-yoga";
import { createServer } from "http";
import { getSchema } from "./api";
import resultHandlerApi from "./services/result-handler-api";
import express from "express";
import getPort from "get-port";
import minimist from "minimist";
import open from "open";
import { initializeStaticRoutes } from "./static-files";
import { root } from "./services/cli";
import readPkgUp from "read-pkg-up";

const pkgResult = readPkgUp.sync({ cwd: __dirname });
const pkg = pkgResult?.packageJson;

const args = minimist(process.argv.slice(2));
const defaultPort = args.port || 4000;
process.env.DEBUG_LOG = args.debug ? "log" : "";

if (args.root) {
  process.env.ROOT = args.root;
}

if (args.version) {
  console.log(`v${pkg?.version}`);
  process.exit();
}

async function main() {
  try {
    const schema = await getSchema();
    const app = express();

    // Enable CORS for development
    app.use((req, res, next) => {
      console.log(`📥 ${req.method} ${req.path}`);
      
      const origin = req.headers.origin || "*";
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.header("Access-Control-Expose-Headers", "Content-Length, X-JSON-Response");
      
      if (req.method === "OPTIONS") {
        console.log(`✅ CORS preflight request handled for origin: ${origin}`);
        return res.sendStatus(200);
      }
      next();
    });

    initializeStaticRoutes(app, root);
    resultHandlerApi(app);

    const yoga = createYoga({ schema, graphqlEndpoint: "/graphql" });
    app.use(yoga.graphqlEndpoint, yoga);

    const port = await getPort({ port: defaultPort });
    process.env.MAJESTIC_PORT = port.toString();

    const server = createServer(app);

    server.listen(port, async () => {
      const url = `http://localhost:${port}`;
      console.log(`⚡ Majestic-Pro v${pkg?.version} is running at ${url}`);
      if (!args.noOpen) {
        await open(url);
      }
    });
  } catch (e) {
    console.error(e);
  }
}

main();
