// 로드맵 데이터 → React Flow 노드/엣지 좌표 변환
//
// 레이아웃: [공통 기초] 줄기가 중앙(x=0)에 세로로 이어지고,
// 마지막 기초 노드 아래에서 좌(Backend)/우(Frontend) 트랙으로 분기한다.
import {
  FOUNDATION,
  FOUNDATION_TITLE,
  TRACKS,
  type Topic,
  type TopicType,
} from "./roadmap";

export interface FlowNode {
  id: string;
  type: "topic" | "root";
  position: { x: number; y: number };
  data: { title: string; topicType: TopicType; hasChildren: boolean };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  variant: "spine" | "branch" | "split";
}

const SPINE_GAP = 210; // 세로 줄기 노드 간격
const CHILD_GAP = 66; // 곁가지 노드 세로 간격
const BRANCH_DX = 360; // 줄기 → 곁가지 가로 거리
const TRACK_DX = 620; // 중앙 → 트랙 컬럼 가로 거리
const ROOT_Y = -150;

export function buildGraph(): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];

  // 곁가지(children)를 dir 방향(±1)으로 배치하는 헬퍼
  const layoutChildren = (parent: Topic, baseX: number, spineY: number, dir: number) => {
    const children = parent.children ?? [];
    const totalH = (children.length - 1) * CHILD_GAP;
    children.forEach((child, k) => {
      const childY = spineY + k * CHILD_GAP - totalH / 2;
      nodes.push({
        id: child.id,
        type: "topic",
        position: { x: baseX + dir * BRANCH_DX, y: childY },
        data: {
          title: child.title,
          topicType: child.type,
          hasChildren: !!child.children?.length,
        },
      });
      edges.push({
        id: `${parent.id}->${child.id}`,
        source: parent.id,
        target: child.id,
        sourceHandle: dir === 1 ? "r" : "l",
        targetHandle: dir === 1 ? "l" : "r",
        variant: "branch",
      });
    });
  };

  // ── 공통 기초 줄기 (중앙) ──
  const foundationRoot = "__root_foundation";
  nodes.push({
    id: foundationRoot,
    type: "root",
    position: { x: 0, y: ROOT_Y },
    data: { title: FOUNDATION_TITLE, topicType: "primary", hasChildren: false },
  });

  FOUNDATION.forEach((topic, i) => {
    const y = i * SPINE_GAP;
    nodes.push({
      id: topic.id,
      type: "topic",
      position: { x: 0, y },
      data: { title: topic.title, topicType: topic.type, hasChildren: !!topic.children?.length },
    });
    const prev = i === 0 ? foundationRoot : FOUNDATION[i - 1].id;
    edges.push({
      id: `${prev}->${topic.id}`,
      source: prev,
      target: topic.id,
      sourceHandle: "b",
      targetHandle: "t",
      variant: "spine",
    });
    layoutChildren(topic, 0, y, topic.side === "left" ? -1 : 1);
  });

  // ── 분기: 마지막 기초 노드 → 각 트랙 ──
  const lastFoundation = FOUNDATION[FOUNDATION.length - 1].id;
  const splitRowY = (FOUNDATION.length - 1) * SPINE_GAP + SPINE_GAP;

  TRACKS.forEach((track) => {
    const dir = track.side === "left" ? -1 : 1;
    const baseX = dir * TRACK_DX;
    const labelId = `__track_${track.id}`;

    // 트랙 라벨(헤더) 노드
    nodes.push({
      id: labelId,
      type: "root",
      position: { x: baseX, y: splitRowY },
      data: { title: track.title, topicType: "primary", hasChildren: false },
    });
    // 기초 줄기 → 트랙 라벨 (분기 연결)
    edges.push({
      id: `${lastFoundation}->${labelId}`,
      source: lastFoundation,
      target: labelId,
      sourceHandle: "b",
      targetHandle: "t",
      variant: "split",
    });

    // 트랙 줄기 (라벨 아래로)
    track.topics.forEach((topic, i) => {
      const y = splitRowY + (i + 1) * SPINE_GAP;
      nodes.push({
        id: topic.id,
        type: "topic",
        position: { x: baseX, y },
        data: { title: topic.title, topicType: topic.type, hasChildren: !!topic.children?.length },
      });
      const prev = i === 0 ? labelId : track.topics[i - 1].id;
      edges.push({
        id: `${prev}->${topic.id}`,
        source: prev,
        target: topic.id,
        sourceHandle: "b",
        targetHandle: "t",
        variant: "spine",
      });
      // 트랙 곁가지는 바깥쪽(dir)으로 뻗어 두 컬럼이 겹치지 않게
      layoutChildren(topic, baseX, y, dir);
    });
  });

  return { nodes, edges };
}
