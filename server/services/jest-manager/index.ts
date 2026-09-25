import { spawn, ChildProcess, execSync } from "child_process";
import { join } from "path";
import Project from "../project";
import { pubsub } from "../../event-emitter";
import { MajesticConfig } from "../types";
import { createLogger, logOperation, logSuccess } from "../../logger";

const log = createLogger("Jest Manager");

export const RunnerEvents = {
  RUNNER_STARTED: "RunnerStarted",
  RUNNER_STOPPED: "RunnerStopped",
  RUNNER_WATCH_MODE_CHANGE: "WatchModeChanged",
  RUNNER_ACTIVE_FILE_CHANGE: "RunnerActiveFileChange",
};

export interface RunnerEvent {
  id: string;
  payload: {
    isRunning: boolean;
  };
}

export default class JestManager {
  project: Project;
  process: ChildProcess;
  config: MajesticConfig;

  constructor(project: Project, config: MajesticConfig) {
    this.project = project;
    this.config = config;
  }

  run(watch: boolean, collectCoverage: boolean) {
    logOperation("🎯 Running all tests", { watch, collectCoverage });
    this.executeJest(
      [
        "--reporters",
        this.getReporterPath(),
        ...(watch ? [this.getWatchFlag()] : []),
      ],
      true,
      true,
      collectCoverage
    );
  }

  runSingleFile(path: string, watch: boolean, collectCoverage: boolean) {
    logOperation("📄 Running single test file", { path, watch, collectCoverage });
    this.executeJest(
      [
        this.getPatternForPath(path),
        ...(watch ? [this.getWatchFlag()] : []),
        "--reporters",
        "default",
        this.getReporterPath(),
        "--verbose=false",
      ],
      !watch,
      false,
      collectCoverage
    );
  }

  runTestByName(filePath: string, testName: string, collectCoverage: boolean) {
    this.executeJest(
      [
        this.getPatternForPath(filePath),
        "--testNamePattern",
        `"${testName}"`,
        "--reporters",
        "default",
        this.getReporterPath(),
        "--verbose=false",
      ],
      false,
      false,
      collectCoverage
    );
  }

  runFailedTests(collectCoverage: boolean) {
    this.executeJest(
      ["--onlyFailures", "--reporters", this.getReporterPath()],
      true,
      true,
      collectCoverage
    );
  }

  runWithOpenHandleDetection(collectCoverage: boolean) {
    this.executeJest(
      ["--detectOpenHandles", "--reporters", this.getReporterPath()],
      true,
      true,
      collectCoverage
    );
  }

  updateSnapshotToFile(path: string) {
    this.executeJest(
      [this.getPatternForPath(path), "-u", "--reporters", this.getReporterPath()],
      false,
      false,
      false
    );
  }

  clearCache() {
    if (!this.config.jestScriptPath) {
      throw new Error("Jest script path is empty");
    }

    const proc = spawn("node", [this.config.jestScriptPath, "--clearCache"], {
      cwd: this.project.projectRoot,
      shell: true,
      stdio: "inherit",
      env: { ...process.env },
    });

    proc.on("exit", () => {
      console.log("Jest cache cleared.");
    });
  }

  getJestConfig(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.config.jestScriptPath) {
        return reject(new Error("Jest script path is empty"));
      }

      const args = [this.config.jestScriptPath, "--showConfig"];
      let output = "";

      const proc = spawn("node", args, {
        cwd: this.project.projectRoot,
        shell: true,
        stdio: "pipe",
        env: { ...process.env },
      });

      proc.stdout?.on("data", (data: Buffer) => {
        output += data.toString();
      });

      proc.on("exit", () => resolve(output));
      proc.on("error", reject);
    });
  }

  switchToAnotherFile(path: string) {
    this.executeInSequence([
      {
        fn: () => this.process.stdin && this.process.stdin.write("p"),
        delay: 0,
      },
      {
        fn: () =>
          this.process.stdin &&
          this.process.stdin.write(this.getPatternForPath(path)),
        delay: 100,
      },
      {
        fn: () =>
          this.process.stdin &&
          this.process.stdin.write(Buffer.from("0d", "hex")),
        delay: 200,
      },
    ]);
  }

  executeJest(
    args: string[] = [],
    inherit: boolean,
    shouldReportSummary: boolean,
    collectCoverage: boolean
  ) {
    if (!this.config.jestScriptPath) {
      throw new Error("Jest script path is empty");
    }

    this.reportStart();

    const finalArgs = [
      "-r",
      this.getPatchFilePath(),
      this.config.jestScriptPath,
      ...(this.config.args || []),
      "--colors",
      ...(collectCoverage
        ? ["--collectCoverage=true"]
        : ["--collectCoverage=false"]),
      ...(this.config.bail ? ["--bail=1"] : []),
      ...(this.config.verbose ? ["--verbose"] : []),
      ...(this.config.forceExit ? ["--forceExit"] : []),
      ...args,
    ];

    const finalEnv = {
      ...(this.config.env || {}),
      MAJESTIC_PORT: process.env.MAJESTIC_PORT,
      REPORT_SUMMARY: shouldReportSummary ? "report" : "",
    };

    logOperation("⚙️  Jest process spawning", {
      projectRoot: this.project.projectRoot,
      args: finalArgs,
      environment: Object.keys(finalEnv),
    });

    this.process = spawn("node", finalArgs, {
      cwd: this.project.projectRoot,
      shell: true,
      stdio: inherit ? "inherit" : "pipe",
      env: { ...(process.env || {}), ...finalEnv },
    });

    logSuccess("Jest process spawned", { pid: this.process.pid });

    this.process.on("exit", (code) => {
      logOperation("Jest process exited", { exitCode: code, pid: this.process.pid });
      this.reportStop();
    });

    this.process.on("error", (err) => {
      logOperation("Jest process error", { error: err.message, pid: this.process.pid });
    });

    this.process.stdout?.on("data", (data: Buffer) => {
      console.log(data.toString().trim());
    });

    this.process.stderr?.on("data", (data: Buffer) => {
      console.log(data.toString().trim());
    });
  }

  getReporterPath() {
    return join(__dirname, "./scripts/reporter.js");
  }

  getPatchFilePath() {
    return join(__dirname, "./scripts/patch.js");
  }

  getPatternForPath(path: string) {
    const replacePattern = process.platform === "win32" ? /\\/g : /\//g;
    return `^${path.replace(replacePattern, ".")}$`;
  }

  stop() {
    logOperation("🛑 Stopping Jest runner", { pid: this.process?.pid });
    if (this.process) {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", "" + this.process.pid, "/T", "/F"]);
      } else {
        this.process.kill();
      }
      logSuccess("Jest process killed", { pid: this.process.pid });
      this.reportStop();
    }
  }

  reportStart() {
    logOperation("📊 Reporter: Starting test run");
    pubsub.publish(RunnerEvents.RUNNER_STARTED, {
      id: RunnerEvents.RUNNER_STARTED,
      payload: { isRunning: true },
    });
  }

  reportStop() {
    logOperation("📊 Reporter: Stopping test run");
    pubsub.publish(RunnerEvents.RUNNER_STOPPED, {
      id: RunnerEvents.RUNNER_STOPPED,
      payload: { isRunning: false },
    });
  }

  async executeInSequence(funcs: Array<{ fn: () => void; delay: number }>) {
    for (const { fn, delay } of funcs) {
      await this.setTimeoutPromisify(fn, delay);
    }
  }

  setTimeoutPromisify(fn: () => void, delay: number): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        fn();
        resolve();
      }, delay);
    });
  }

  getWatchFlag() {
    return this.isInGitRepository() ? "--watch" : "--watchAll";
  }

  isInGitRepository() {
    try {
      execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }
}
