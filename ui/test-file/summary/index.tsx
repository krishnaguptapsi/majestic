import React from "react";
import styled from "styled-components";
import { space, fontSize, color } from "styled-system";
import { useSpring, animated } from "@react-spring/web";
import {
  Folder,
  Code,
  Play,
  StopCircle,
  Camera,
  CheckCircle,
  ZapOff,
  Eye,
} from "react-feather";
import Button from "../../components/button";
import OPEN_IN_EDITOR from "./open-in-editor.gql";
import OPEN_SNAP_IN_EDITOR from "./open-snap-in-editor.gql";
import Tippy from "@tippyjs/react";
import { useMutation } from "@apollo/client";

const Container = styled.div<{ p?: any; bg?: string }>`
  position: relative;
  ${space};
  ${color};
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  overflow: hidden;
  flex-wrap: wrap;
`;

const ContainerBG = styled(animated.div)`
  @keyframes MOVE-BG {
    from { transform: translateX(0); }
    to { transform: translateX(27px); }
  }
  border-radius: 3px;
  position: absolute;
  top: 0; bottom: 0; right: 0;
  left: -46px;
  background: repeating-linear-gradient(
    45deg,
    #404148, #404148 10px,
    #242326 10px, #242326 20px
  );
  animation: MOVE-BG 0.5s linear infinite;
`;

const RightContainer = styled.div`z-index: 1;`;
const InfoContainer = styled.div`display: flex;`;
const Info = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  margin-right: 15px;
  font-weight: 600;
  ${color}
`;
const InfoLabel = styled.div`margin-left: 5px;`;
const FilePath = styled.div<{ fontSize?: any; mb?: any }>`
  ${fontSize};
  ${space};
  word-break: break-all;
  font-weight: 600;
  margin-right: 5px;
`;
const ActionPanel = styled.div`
  display: flex;
  align-items: center;
  z-index: 1;
`;
const LoadingResult = styled.div`
  color: #d9eef2;
  margin-right: 10px;
  font-size: 12px;
`;

interface Props {
  path: string;
  projectRoot: string;
  suiteCount: number;
  testCount: number;
  todoCount: number;
  passingTests: number;
  failingTests: number;
  isRunning: boolean;
  isUpdating: boolean;
  isLoadingResult: boolean;
  onRun: () => void;
  onStop: () => void;
  onSnapshotUpdate: () => void;
  haveSnapshotFailures?: boolean;
}

export default function FileSummary({
  path,
  projectRoot,
  suiteCount,
  testCount,
  todoCount,
  passingTests,
  failingTests,
  isRunning,
  isUpdating,
  isLoadingResult,
  onRun,
  onStop,
  onSnapshotUpdate,
}: Props) {
  const Icon = isRunning ? StopCircle : Play;

  const [openInEditor] = useMutation(OPEN_IN_EDITOR, { variables: { path } });
  const [openSnapshotInEditor] = useMutation(OPEN_SNAP_IN_EDITOR, { variables: { path } });

  return (
    <Container p={4} bg="slightDark">
      {(isUpdating || isLoadingResult) && <ContainerBG />}
      <RightContainer>
        <FilePath fontSize={15} mb={3}>
          {path.replace(projectRoot, "")}
        </FilePath>
        <InfoContainer>
          <Info color="primary">
            <Folder size={14} /> <InfoLabel>{suiteCount} Suites</InfoLabel>
          </Info>
          <Info color="primary">
            <Code size={14} /> <InfoLabel>{testCount} Tests</InfoLabel>
          </Info>
          <Info color="success">
            <CheckCircle size={14} />{" "}
            <InfoLabel>{passingTests} Passing</InfoLabel>
          </Info>
          <Info color="danger">
            <ZapOff size={14} />{" "}
            <InfoLabel>{failingTests} Failing</InfoLabel>
          </Info>
        </InfoContainer>
      </RightContainer>
      <ActionPanel>
        {isLoadingResult && <LoadingResult>Loading test results</LoadingResult>}
        <Tippy content="Run file" placement="bottom">
          <span>
            <Button
              icon={<Icon size={14} />}
              minimal
              onClick={() => (isRunning ? onStop() : onRun())}
            >
              {isRunning ? "Stop" : "Run"}
            </Button>
          </span>
        </Tippy>
        <Tippy content="Open in editor" placement="bottom">
          <span>
            <Button icon={<Code size={14} />} minimal onClick={() => openInEditor()} />
          </span>
        </Tippy>
        <Tippy content="Update all snapshots for this file" placement="bottom">
          <span>
            <Button minimal icon={<Camera size={14} />} onClick={() => onSnapshotUpdate()}>
              Update Snapshot
            </Button>
          </span>
        </Tippy>
        <Tippy content="Open snapshot in editor" placement="bottom">
          <span>
            <Button icon={<Eye size={14} />} minimal onClick={() => openSnapshotInEditor()} />
          </span>
        </Tippy>
      </ActionPanel>
    </Container>
  );
}
