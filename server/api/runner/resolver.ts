import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Subscription,
  Root,
} from "type-graphql";
import { Runner } from "./type";
import JestManager, {
  RunnerEvents,
  RunnerEvent,
} from "../../services/jest-manager";
import Workspace from "../../services/project";
import { root } from "../../services/cli";
import { RunnerStatus } from "./status";
import { pubsub } from "../../event-emitter";
import ConfigResolver from "../../services/config-resolver";

@Resolver(Runner)
export default class RunnerResolver {
  private jestManager: JestManager;
  private workspace: Workspace;
  private isRunning: boolean = false;
  private activeFile: string = "";
  private isWatching: boolean = false;
  private collectCoverage: boolean = false;
  private bail: boolean = false;
  private verbose: boolean = false;
  private forceExit: boolean = false;

  constructor() {
    this.workspace = new Workspace(root);
    const configResolver = new ConfigResolver();
    const majesticConfig = configResolver.getConfig(root);
    this.jestManager = new JestManager(this.workspace, majesticConfig);
  }

  @Query(() => RunnerStatus)
  runnerStatus() {
    const status = new RunnerStatus();
    status.activeFile = this.activeFile;
    status.running = this.isRunning;
    status.watching = this.isWatching;
    return status;
  }

  @Query(() => Boolean)
  shouldCollectCoverage() {
    return this.collectCoverage;
  }

  @Query(() => Boolean)
  shouldBail() {
    return this.bail;
  }

  @Query(() => Boolean)
  isVerbose() {
    return this.verbose;
  }

  @Query(() => Boolean)
  shouldForceExit() {
    return this.forceExit;
  }

  @Query(() => String)
  async jestConfig() {
    return this.jestManager.getJestConfig();
  }

  @Subscription(() => RunnerStatus, {
    topics: [
      RunnerEvents.RUNNER_STARTED,
      RunnerEvents.RUNNER_STOPPED,
      RunnerEvents.RUNNER_WATCH_MODE_CHANGE,
      RunnerEvents.RUNNER_ACTIVE_FILE_CHANGE,
    ],
  })
  runnerStatusChange(@Root() event: RunnerEvent) {
    this.isRunning =
      event.payload.isRunning !== undefined
        ? event.payload.isRunning
        : this.isRunning;

    const status = new RunnerStatus();
    status.activeFile = this.activeFile;
    status.running = this.isRunning;
    status.watching = this.isWatching;
    return status;
  }

  @Mutation(() => String, { nullable: true })
  runFile(@Arg("path") path: string) {
    this.activeFile = path;

    if (this.isWatching && this.isRunning) {
      pubsub.publish(RunnerEvents.RUNNER_ACTIVE_FILE_CHANGE, {
        id: RunnerEvents.RUNNER_ACTIVE_FILE_CHANGE,
        payload: {},
      });
      return this.jestManager.switchToAnotherFile(path);
    }

    return this.jestManager.runSingleFile(
      path,
      this.isWatching,
      this.collectCoverage
    );
  }

  @Mutation(() => String, { nullable: true })
  run() {
    this.activeFile = "";
    this.isRunning = true;
    return this.jestManager.run(this.isWatching, this.collectCoverage);
  }

  @Mutation(() => String, { nullable: true })
  stop() {
    return this.jestManager.stop();
  }

  @Mutation(() => String, { nullable: true })
  updateSnapshot(@Arg("path") path: string) {
    this.activeFile = path;
    return this.jestManager.updateSnapshotToFile(path);
  }

  @Mutation(() => RunnerStatus, { nullable: true })
  toggleWatch(@Arg("watch") watch: boolean) {
    this.isWatching = watch;
    pubsub.publish(RunnerEvents.RUNNER_WATCH_MODE_CHANGE, {
      id: RunnerEvents.RUNNER_WATCH_MODE_CHANGE,
      payload: {},
    });
    return new RunnerStatus();
  }

  @Mutation(() => Boolean)
  setCollectCoverage(@Arg("collect") collect: boolean) {
    this.collectCoverage = collect;
    return this.collectCoverage;
  }

  // --- New Jest commands ---

  @Mutation(() => String, { nullable: true })
  runTestByName(
    @Arg("path") path: string,
    @Arg("testName") testName: string
  ) {
    this.activeFile = path;
    return this.jestManager.runTestByName(path, testName, this.collectCoverage);
  }

  @Mutation(() => String, { nullable: true })
  runFailedTests() {
    this.activeFile = "";
    this.isRunning = true;
    return this.jestManager.runFailedTests(this.collectCoverage);
  }

  @Mutation(() => Boolean)
  setBail(@Arg("bail") bail: boolean) {
    this.bail = bail;
    this.jestManager.config.bail = bail;
    return this.bail;
  }

  @Mutation(() => String, { nullable: true })
  clearCache() {
    return this.jestManager.clearCache();
  }

  @Mutation(() => Boolean)
  setVerbose(@Arg("verbose") verbose: boolean) {
    this.verbose = verbose;
    this.jestManager.config.verbose = verbose;
    return this.verbose;
  }

  @Mutation(() => Boolean)
  setForceExit(@Arg("forceExit") forceExit: boolean) {
    this.forceExit = forceExit;
    this.jestManager.config.forceExit = forceExit;
    return this.forceExit;
  }

  @Mutation(() => String, { nullable: true })
  runWithOpenHandleDetection() {
    this.activeFile = "";
    this.isRunning = true;
    return this.jestManager.runWithOpenHandleDetection(this.collectCoverage);
  }
}
