import React, { useState } from "react";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/client";
import { space, color } from "styled-system";
import Tippy from "@tippyjs/react";
import SET_WATCH_MODE from "./set-watch-mode.gql";
import SHOULD_COLLECT_COVERAGE from "./should-collect-coverage.gql";
import SET_COLLECT_COVERAGE from "./set-collect-coverage.gql";
import RUN_FAILED_TESTS from "./run-failed-tests.gql";
import CLEAR_CACHE from "./clear-cache.gql";
import SET_VERBOSE from "./set-verbose.gql";
import IS_VERBOSE from "./is-verbose.gql";
import SET_BAIL from "./set-bail.gql";
import SHOULD_BAIL from "./should-bail.gql";
import SET_FORCE_EXIT from "./set-force-exit.gql";
import SHOULD_FORCE_EXIT from "./should-force-exit.gql";
import JEST_CONFIG from "./jest-config.gql";
import RUN_TEST_BY_NAME from "./run-test-by-name.gql";
import RUN_WITH_OPEN_HANDLE_DETECTION from "./run-with-open-handle-detection.gql";
import SET_CHANGED_SINCE from "./set-changed-since.gql";
import GET_CHANGED_SINCE from "./get-changed-since.gql";
import SET_CHANGED_FILES_WITH_ANCESTOR from "./set-changed-files-with-ancestor.gql";
import SHOULD_USE_CHANGED_FILES_WITH_ANCESTOR from "./should-use-changed-files-with-ancestor.gql";
import { Workspace } from "../../server/api/workspace/workspace";
import { transform, filterFailure } from "./transformer";
import Summary from "./summary";
import { Summary as SummaryType } from "../../server/api/workspace/summary";
import RUN from "./run.gql";
import useKeys, { hasKeys } from "../hooks/use-keys";
import {
  Play,
  Eye,
  Search,
  RefreshCw,
  ZapOff,
  StopCircle,
  FileText,
  Layers,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Trash2,
  List,
  Zap,
  Git,
  Clock
} from "react-feather";
import Button from "../components/button";
import { RunnerStatus } from "../../server/api/runner/status";
import Tree from "./tree";
import Logo from "./logo";

const Container = styled.div<any>`
  ${space};
  ${color};
  height: 100vh;
`;

const ActionsPanel = styled.div<any>`
  ${space}
  display: flex;
  justify-content: space-between;
`;

const RightActionPanel = styled.div`
  display: flex;
`;

const FileHeader = styled.div<any>`
  ${space}
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

const FilesHeader = styled.div`
  font-weight: 400;
  font-size: 11px;
`;

const RightFilesAction = styled.div`
  display: flex;
`;

interface Props {
  selectedFile: string;
  workspace: Workspace;
  summary: SummaryType | undefined;
  runnerStatus?: RunnerStatus;
  showCoverage: boolean;
  onSelectedFileChange: (path: string) => void;
  onSearchOpen: () => void;
  onRefreshFiles: () => void;
  onStop: () => void;
  onShowCoverage: () => void;
}

export default function TestExplorer({
  selectedFile,
  workspace,
  onSelectedFileChange,
  summary,
  showCoverage,
  runnerStatus,
  onSearchOpen,
  onRefreshFiles,
  onStop,
  onShowCoverage
}: Props) {
  const failedItems = (summary && summary.failedTests) || [];
  const executingItems = (summary && summary.executingTests) || [];
  const passingTests = (summary && summary.passingTests) || [];

  const [run] = useMutation(RUN);
  const [runFailedTests] = useMutation(RUN_FAILED_TESTS);
  const [clearCache] = useMutation(CLEAR_CACHE);
  const [setVerbose] = useMutation(SET_VERBOSE);
  const { data: { isVerbose } = {} } = useQuery<any>(IS_VERBOSE);
  const [setBail] = useMutation(SET_BAIL);
  const { data: { shouldBail } = {} } = useQuery<any>(SHOULD_BAIL);
  const [setForceExit] = useMutation(SET_FORCE_EXIT);
  const { data: { shouldForceExit } = {} } = useQuery<any>(SHOULD_FORCE_EXIT);
  const [runTestByName] = useMutation(RUN_TEST_BY_NAME);
  const [runWithOpenHandleDetection] = useMutation(RUN_WITH_OPEN_HANDLE_DETECTION);
  const { data: { jestConfig } = {} } = useQuery<any>(JEST_CONFIG);
  const [setChangedSince] = useMutation(SET_CHANGED_SINCE);
  const { data: { changedSince } = {} } = useQuery<any>(GET_CHANGED_SINCE);
  const [setChangedFilesWithAncestor] = useMutation(SET_CHANGED_FILES_WITH_ANCESTOR);
  const { data: { changedFilesWithAncestor } = {} } = useQuery<any>(SHOULD_USE_CHANGED_FILES_WITH_ANCESTOR);

  const [collapsedItems, setCollapsedItems] = useState({});
  const [changedSinceDate, setChangedSinceDate] = useState("");
  const handleFileToggle = (path: string, isCollapsed: boolean) => {
    setCollapsedItems({
      ...collapsedItems,
      [path]: isCollapsed
    });
  };

  const [showFailedTests, setShowFailedTests] = useState(false);

  const items = workspace.files;
  const root = items[0];
  let files = transform(
    root as any,
    executingItems,
    failedItems,
    passingTests,
    collapsedItems,
    showFailedTests,
    items
  );

  const onCollapseAll = () => {
    const newCollapsedItems = {};
    files.forEach(file => {
      if (file.type === "directory" && file.parent) {
        newCollapsedItems[file.path] = true;
      }
    });
    setCollapsedItems(newCollapsedItems)
  }
  const onExpandAll = () => {
    setCollapsedItems({})
  }

  if (showFailedTests && failedItems.length) {
    files = filterFailure(files);
  }

  const {
    data: { shouldCollectCoverage },
    refetch: refetchCoverageFlag
  } = useQuery<any>(SHOULD_COLLECT_COVERAGE);
  const [setCollectCoverage] = useMutation(SET_COLLECT_COVERAGE);

  const handleFileSelection = (path: string) => {
    onSelectedFileChange(path);
  };

  const [setWatchMode] = useMutation(SET_WATCH_MODE);
  const handleSetWatchModel = (watch: boolean) => {
    setWatchMode({
      variables: {
        watch
      }
    });
  };

  const isRunning = runnerStatus && runnerStatus.running;

  const runFailed = () => {
    runFailedTests();
  };

  const clearJestCache = () => {
    clearCache();
  };

  const toggleVerbose = () => {
    setVerbose({
      variables: {
        verbose: !isVerbose
      }
    });
  };

  const toggleBail = () => {
    setBail({
      variables: {
        bail: !shouldBail
      }
    });
  };

  const toggleForceExit = () => {
    setForceExit({
      variables: {
        forceExit: !shouldForceExit
      }
    });
  };

  const toggleDetectOpenHandles = () => {
    runWithOpenHandleDetection();
  };

  const handleSetChangedSince = (date: string) => {
    setChangedSinceDate(date);
    if (date) {
      setChangedSince({
        variables: {
          date
        }
      });
    }
  };

  const toggleChangedFilesWithAncestor = () => {
    setChangedFilesWithAncestor({
      variables: {
        enabled: !changedFilesWithAncestor
      }
    });
  };

  const keys = useKeys();
  if (hasKeys(["Alt", "t"], keys)) {
    run();
  } else if (hasKeys(["Alt", "w"], keys)) {
    if (runnerStatus) {
      handleSetWatchModel(!runnerStatus.watching);
    }
  } else if (hasKeys(["Alt", "s"], keys)) {
    onSearchOpen();
  } else if (hasKeys(["Alt", "f"], keys)) {
    runFailed();
  } else if (hasKeys(["Alt", "c"], keys)) {
    clearJestCache();
  } else if (hasKeys(["Alt", "v"], keys)) {
    toggleVerbose();
  } else if (hasKeys(["Alt", "d"], keys)) {
    toggleChangedFilesWithAncestor();
  }

  return (
    <Container p={4} bg="veryDark" color="text">
      <Logo />
      <ActionsPanel mb={4}>
        <Tippy content="Run all tests" placement="bottom">
          <Button
            icon={isRunning ? <StopCircle size={15} /> : <Play size={15} />}
            size="sm"
            onClick={() => {
              if (isRunning) {
                onStop();
              } else {
                run();
              }
            }}
          >
            {isRunning ? "Stop" : "Run tests"}
          </Button>
        </Tippy>
        <RightActionPanel>
          <Tippy content="Toggle watch mode" placement="bottom">
            <Button
              icon={<Eye size={14} />}
              minimal
              onClick={() => {
                if (runnerStatus) {
                  handleSetWatchModel(!runnerStatus.watching);
                }
              }}
            >
              {runnerStatus && runnerStatus.watching
                ? "Stop Watching"
                : "Watch"}
            </Button>
          </Tippy>
          <Tippy content="Collect coverage" placement="bottom">
            <Button
              minimal={!shouldCollectCoverage}
              onClick={() => {
                setCollectCoverage({
                  variables: {
                    collect: !shouldCollectCoverage
                  }
                });
                refetchCoverageFlag();
              }}
            >
              <FileText size={14} />
            </Button>
          </Tippy>
          <Tippy content="Search test files" placement="bottom">
            <Button
              minimal
              onClick={() => {
                onSearchOpen();
              }}
            >
              <Search size={14} />
            </Button>
          </Tippy>
          <Tippy content="Run failed tests (Alt+f)" placement="bottom">
            <Button
              minimal
              onClick={runFailed}
            >
              <AlertCircle size={14} />
            </Button>
          </Tippy>
          <Tippy content="Clear cache (Alt+c)" placement="bottom">
            <Button
              minimal
              onClick={clearJestCache}
            >
              <Trash2 size={14} />
            </Button>
          </Tippy>
          <Tippy content="Toggle verbose (Alt+v)" placement="bottom">
            <Button
              minimal={!isVerbose}
              onClick={toggleVerbose}
            >
              <List size={14} />
            </Button>
          </Tippy>
          <Tippy content={`Bail mode ${shouldBail ? 'on' : 'off'}`} placement="bottom">
            <Button
              minimal={!shouldBail}
              onClick={toggleBail}
            >
              <Zap size={14} />
            </Button>
          </Tippy>
          <Tippy content={`Force exit ${shouldForceExit ? 'on' : 'off'}`} placement="bottom">
            <Button
              minimal={!shouldForceExit}
              onClick={toggleForceExit}
            >
              <StopCircle size={14} />
            </Button>
          </Tippy>
          <Tippy content={`Changed files with ancestor ${changedFilesWithAncestor ? 'on' : 'off'} (Alt+d)`} placement="bottom">
            <Button
              minimal={!changedFilesWithAncestor}
              onClick={toggleChangedFilesWithAncestor}
            >
              <Git size={14} />
            </Button>
          </Tippy>
          <Tippy content="Set changed since date" placement="bottom">
            <input
              type="date"
              value={changedSinceDate}
              onChange={(e) => handleSetChangedSince(e.target.value)}
              style={{
                padding: "4px 8px",
                marginLeft: "8px",
                marginRight: "8px",
                borderRadius: "4px",
                border: "1px solid #555",
                backgroundColor: "#333",
                color: "#fff",
                fontSize: "12px"
              }}
            />
          </Tippy>
        </RightActionPanel>
      </ActionsPanel>
      <Summary summary={summary} />
      <FileHeader mt={4} mb={3}>
        <FilesHeader>Tests</FilesHeader>
        <RightFilesAction>
          {summary && summary.failedTests && summary.failedTests.length > 0 && (
            <Tippy content="Show only failed tests" placement="top">
              <Button
                size="sm"
                minimal={!showFailedTests}
                onClick={() => {
                  setShowFailedTests(!showFailedTests);
                }}
              >
                <ZapOff size={10} />
              </Button>
            </Tippy>
          )}
          {!showFailedTests && (
            <Tippy content="Collapse All Tests" placement="top">
              <Button
                size="sm"
                minimal
                onClick={onCollapseAll}
              >
                <ChevronRight size={10} />
              </Button>
            </Tippy>
          )}
          {!showFailedTests && (
            <Tippy content="Expand All Tests" placement="top">
              <Button
                size="sm"
                minimal
                onClick={onExpandAll}
              >
                <ChevronDown size={10} />
              </Button>
            </Tippy>
          )}
          {summary && summary.haveCoverageReport && (
            <Tippy content="Show coverage report" placement="top">
              <Button
                size="sm"
                minimal={!showCoverage}
                onClick={() => {
                  onShowCoverage();
                }}
              >
                <Layers size={10} />
              </Button>
            </Tippy>
          )}
          <Tippy content="Refresh files" placement="top">
            <Button
              size="sm"
              minimal
              onClick={() => {
                onRefreshFiles();
              }}
            >
              <RefreshCw size={10} />
            </Button>
          </Tippy>
        </RightFilesAction>
      </FileHeader>
      <Tree
        results={files}
        selectedFile={selectedFile}
        onFileSelection={handleFileSelection}
        onToggle={handleFileToggle}
      />
    </Container>
  );
}
