import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { useQuery, useMutation } from "@apollo/client";
import Sidebar from "./sidebar";
import TestFile from "./test-file";
import APP from "./app.gql";
import WORKSPACE from "./query.gql";
import useKeys from "./hooks/use-keys";
import useSubscription from "./test-file/use-subscription";
import SUMMARY_QUERY from "./summary-query.gql";
import SUMMARY_SUBS from "./summary-subscription.gql";
import RUNNER_STATUS_QUERY from "./runner-status-query.gql";
import RUNNER_STATUS_SUBS from "./runner-status-subs.gql";
import STOP_RUNNER from "./stop-runner.gql";
import { Search } from "./search";
import SET_SELECTED_FILE from "./set-selected-file.gql";
import { Workspace } from "../server/api/workspace/workspace";
import { color } from "styled-system";
import { RunnerStatus } from "../server/api/runner/status";
import { Summary } from "../server/api/workspace/summary";
import CoveragePanel from "./coverage-panel";
import { BackgroundFuturistic } from "./components/BackgroundAnimation";
import { TestStatusOverlay } from "./components/TestStatusOverlay";

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
`;

const PlaceHolder = styled.div<{ bg?: string }>`
  display: flex;
  height: 100%;
  ${color}
`;

const ResizeHandle = styled(PanelResizeHandle)`
  width: 4px;
  background: #2a2a2a;
  cursor: col-resize;
  &:hover {
    background: #444;
  }
`;

interface AppResult {
  app: { selectedFile: string };
}

interface WorkspaceResult {
  workspace: Workspace;
}

export default function App() {
  const {
    data: {
      app: { selectedFile },
    },
    refetch,
  } = useQuery<AppResult>(APP);

  const {
    data: { workspace },
    refetch: refetchFiles,
  } = useQuery<WorkspaceResult>(WORKSPACE);

  const { data: summary }: { data: Summary } = useSubscription(
    SUMMARY_QUERY,
    SUMMARY_SUBS,
    {},
    (result: any) => result.summary,
    (result: any) => result.changeToSummary,
    "Summary Sub"
  );

  const { data: runnerStatus }: { data: RunnerStatus } = useSubscription(
    RUNNER_STATUS_QUERY,
    RUNNER_STATUS_SUBS,
    {},
    (result: any) => result.runnerStatus,
    (result: any) => result.runnerStatusChange,
    "Runner subs"
  );

  const [setSelectedFile] = useMutation(SET_SELECTED_FILE);
  const handleFileSelection = (path: string | null) => {
    if (path !== null) {
      setShowCoverage(false);
    }
    setSelectedFile({ variables: { path } });
    refetch();
  };

  const [stopRunner] = useMutation(STOP_RUNNER);

  const [isSearchOpen, setSearchOpen] = useState(false);
  const keys = useKeys();
  if (isSearchOpen && keys.has("Escape")) {
    setSearchOpen(false);
  }

  const [showCoverage, setShowCoverage] = useState(false);

  // Calculate test status for overlay
  const testStatus = useMemo(() => {
    const isRunning = runnerStatus?.running || false;
    const passedCount = summary?.numPassedTests || 0;
    const failedCount = summary?.numFailedTests || 0;
    const totalCount = summary?.numTotalTests || 0;

    return { isRunning, passedCount, failedCount, totalCount };
  }, [runnerStatus, summary]);

  return (
    <ContainerDiv>
      {/* Background Animation */}
      <BackgroundFuturistic />

      <PanelGroup direction="horizontal">
        <Panel defaultSize={25} minSize={18}>
          <Sidebar
            workspace={workspace}
            selectedFile={selectedFile}
            onSelectedFileChange={handleFileSelection}
            summary={summary}
            runnerStatus={runnerStatus}
            showCoverage={showCoverage}
            onSearchOpen={() => setSearchOpen(true)}
            onRefreshFiles={() => refetchFiles()}
            onStop={() => stopRunner()}
            onShowCoverage={() => setShowCoverage(!showCoverage)}
          />
        </Panel>
        <ResizeHandle />
        <Panel defaultSize={75}>
          {showCoverage && <CoveragePanel />}
          {selectedFile ? (
            <TestFile
              projectRoot={workspace.projectRoot}
              selectedFilePath={selectedFile}
              isRunning={
                (runnerStatus.running &&
                  runnerStatus.activeFile === selectedFile) ||
                ((summary && summary.executingTests) || []).includes(
                  selectedFile
                )
              }
              onStop={() => stopRunner()}
            />
          ) : (
            <PlaceHolder bg="dark" />
          )}
        </Panel>
      </PanelGroup>

      {/* Test Status Overlay */}
      <TestStatusOverlay
        isRunning={testStatus.isRunning}
        passedCount={testStatus.passedCount}
        failedCount={testStatus.failedCount}
        totalCount={testStatus.totalCount}
        position="bottom-right"
        showBot
        compact={false}
      />

      <Search
        projectRoot={workspace.projectRoot}
        show={isSearchOpen}
        files={workspace.files}
        onClose={() => setSearchOpen(false)}
        onItemClick={path => {
          handleFileSelection(path);
          setSearchOpen(false);
        }}
      />
    </ContainerDiv>
  );
}
