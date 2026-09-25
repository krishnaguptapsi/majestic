import "reflect-metadata";
import { createYoga } from "graphql-yoga";
import { createServer } from "http";
import { getSchema } from "./api";
import resultHandlerApi from "./services/result-handler-api";
import express from "express";
import getPort from "get-port";
import minimist from "minimist";
import open from "open";
import chromeLauncher from "chrome-launcher";
import { initializeStaticRoutes } from "./static-files";
import { root } from "./services/cli";
import readPkgUp from "read-pkg-up";
import { logOperation, logSuccess } from "./logger";

const pkgResult = readPkgUp.sync({ cwd: __dirname });
const pkg = pkgResult?.packageJson;

const args = minimist(process.argv.slice(2));
const defaultPort = args.port || 4000;

// Enable debug logging if --debug flag is provided
if (args.debug) {
  process.env.DEBUG_LOG = "true";
  console.log("🔍 Debug mode enabled - verbose logging active");
}

if (args.root) {
  process.env.ROOT = args.root;
}

if (args.version) {
  console.log(`v${pkg?.version}`);
  process.exit();
}

if (args.help || args.h) {
  console.log(`
Majestic Pro v${pkg?.version}

Usage: majestic-pro [options]

Options:
  --port <number>        Port to run the server on (default: 4000)
  --root <path>          Root directory to analyze (default: cwd)
  --debug                Enable verbose debug logging of all operations
  --app                  Launch as a Chrome app window instead of opening in browser
  --no-open              Don't automatically open browser
  --version, -v          Show version
  --help, -h             Show this help message
`);
  process.exit();
}

async function main() {
  try {
    const schema = await getSchema();
    const app = express();

    // Enable CORS for development
    app.use((req, res, next) => {
      if (process.env.DEBUG_LOG) {
        console.log(`📥 ${req.method} ${req.path}`);
        console.log(`   📋 Headers:`, JSON.stringify(req.headers, null, 2));
        if (Object.keys(req.query).length > 0) {
          console.log(`   🔍 Query:`, JSON.stringify(req.query, null, 2));
        }
        if (req.body && Object.keys(req.body).length > 0) {
          console.log(`   📦 Body:`, JSON.stringify(req.body, null, 2));
        }
      }

      const origin = req.headers.origin || "*";
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.header("Access-Control-Expose-Headers", "Content-Length, X-JSON-Response");

      if (req.method === "OPTIONS") {
        if (process.env.DEBUG_LOG) {
          console.log(`✅ CORS preflight request handled for origin: ${origin}`);
        }
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

      if (args.app) {
        try {
          logOperation("🚀 Launching Chrome app window", { url });
          await chromeLauncher.launch({
            startingUrl: url,
            chromeFlags: [`--app=${url}`]
          });
          logSuccess("Chrome app launched successfully");
        } catch (err) {
          console.error("❌ Failed to launch Chrome app:", err);
          console.log("Falling back to opening in default browser...");
          await open(url);
        }
      } else if (!args.noOpen) {
        await open(url);
      }
    });
  } catch (e) {
    console.error(e);
  }
}

main();
