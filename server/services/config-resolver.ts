import minimist from "minimist";
import { readPackageUpSync } from "read-pkg-up";
import { sync as resolveSync } from "resolve";
import { MajesticConfig } from "./types";
import { platform } from "os";
import { join } from "path";
import { existsSync } from "fs";
import { createLogger } from "../logger";

const log = createLogger("Config Resolver");

export default class ConfigResolver {
  public getConfig(projectRoot: string): MajesticConfig {
    let jestScriptPath = null;
    let args: string[] = [];
    let env: any = {};
    const configFromPkgJson = this.getConfigFromPackageJson(projectRoot) || {};

    const jestScriptPathFromPackage = configFromPkgJson.jestScriptPath
      ? join(projectRoot, configFromPkgJson.jestScriptPath)
      : null;

    if (this.isBootstrappedWithCreateReactApp(projectRoot)) {
      log("Project identified as Create react app");

      jestScriptPath =
        jestScriptPathFromPackage ||
        this.getJestScriptForCreateReactApp(projectRoot);
      args = ["--env=jsdom"];
      env = { CI: "true" };
    } else {
      log("Majestic configuration from Package.json: ", configFromPkgJson);
      jestScriptPath =
        jestScriptPathFromPackage || this.getJestScriptPath(projectRoot);
    }

    const configArg = minimist(process.argv.slice(2)).config;

    if (configArg && configFromPkgJson.configs) {
      args = [...args, ...(configFromPkgJson.configs[configArg].args || [])];
      env = { ...env, ...(configFromPkgJson.configs[configArg].env || {}) };
    } else {
      args = [...args, ...(configFromPkgJson.args || [])];
      env = { ...env, ...(configFromPkgJson.env || {}) };
    }

    const majesticConfig = {
      jestScriptPath: `"${jestScriptPath}"`,
      args,
      env,
    };

    log("Resolved Majestic config :", majesticConfig);
    return majesticConfig;
  }

  private getJestScriptPath(projectRoot: string) {
    try {
      const resolved = resolveSync("jest/bin/jest.js", { basedir: projectRoot });
      log("Path of resolved Jest script: ", resolved);
      return resolved;
    } catch {
      console.error(
        "🚨 Majestic was unable to find Jest package in node_modules folder. Provide the path manually via jestScriptPath in package.json majestic config."
      );
      process.exit(1);
    }
  }

  private getJestScriptForCreateReactApp(projectRoot: string) {
    const resolved = resolveSync("react-scripts/scripts/test.js", {
      basedir: projectRoot,
    });
    return resolved;
  }

  private getPackageJson(rootPath: string) {
    const result = readPackageUpSync({ cwd: rootPath });
    return result?.packageJson;
  }

  private getConfigFromPackageJson(projectRoot: string) {
    const packageJson = this.getPackageJson(projectRoot) as any;
    if (packageJson?.majestic) {
      return packageJson.majestic;
    }
    return null;
  }

  private isBootstrappedWithCreateReactApp(rootPath: string): boolean {
    return (
      this.hasExecutable(rootPath, "node_modules/.bin/react-scripts") ||
      this.hasExecutable(
        rootPath,
        "node_modules/react-scripts/node_modules/.bin/jest"
      ) ||
      this.hasExecutable(rootPath, "node_modules/react-native-scripts")
    );
  }

  private hasExecutable(rootPath: string, executablePath: string): boolean {
    const ext = platform() === "win32" ? ".cmd" : "";
    const absolutePath = join(rootPath, executablePath + ext);
    return existsSync(absolutePath);
  }
}
