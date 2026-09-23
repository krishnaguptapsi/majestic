import { Resolver, Mutation, Arg, Query } from "type-graphql";
import launch from "launch-editor";
import { App } from "./app";
import FileWatcher, { WatcherEvents } from "../../services/file-watcher";
import { pubsub } from "../../event-emitter";
import { dirname, basename } from "path";

@Resolver(App)
export default class AppResolver {
  private appInstance: App;
  private fileWatcher: FileWatcher;

  constructor() {
    this.fileWatcher = new FileWatcher();
    this.appInstance = new App();
  }

  @Query(() => App)
  app() {
    return this.appInstance;
  }

  @Mutation(() => App)
  setSelectedFile(@Arg("path", { nullable: true }) path: string) {
    this.appInstance.selectedFile = path;

    if (path) {
      this.fileWatcher.watch(path);
      pubsub.publish(WatcherEvents.FILE_CHANGE, {
        id: WatcherEvents.FILE_CHANGE,
        payload: { path },
      });
    }

    return this.appInstance;
  }

  @Mutation(() => String)
  openInEditor(@Arg("path") path: string) {
    launch(path, process.env.EDITOR || "code", (filePath: string, err: any) => {
      console.log("Failed to open file in editor:", err);
    });
    return "";
  }

  @Mutation(() => String)
  openSnapInEditor(@Arg("path") path: string) {
    const dir = dirname(path);
    const file = basename(path);
    const snap = `${dir}/__snapshots__/${file}.snap`;
    this.openInEditor(snap);
    return "";
  }

  @Mutation(() => String)
  openFailure(@Arg("failure") failure: string) {
    const re = /^\s+at.*?\((.*?)\)$/m;
    const match = failure.match(re);
    if (match && match.length === 2) {
      launch(match[1], process.env.EDITOR || "code", (filePath: string, err: any) => {
        console.log("Failed to open file in editor:", err);
      });
    } else {
      console.log("Failed to find a file path in the failure string.");
    }
    return "";
  }
}
