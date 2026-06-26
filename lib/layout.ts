// ROADMAP 트리 → React Flow 노드/엣지 좌표 변환
import { ROADMAP, type Topic, type TopicType } from "./roadmap";

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
  variant: "spine" | "branch";
}

const SPINE_GAP = 210; // 메인 줄기 노드 세로 간격
const CHILD_GAP = 66; // 곁가지 노드 세로 간격
const BRANCH_DX = 360; // 줄기 → 곁가지 가로 거리
const ROOT_Y = -150;

export function buildGraph(): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];

  // 최상단 루트 라벨
  nodes.push({
    id: "__root",
    type: "root",
    position: { x: 0, y: ROOT_Y },
    data: { title: "Backend", topicType: "primary", hasChildren: false },
  });

  ROADMAP.forEach((topic: Topic, i: number) => {
    const spineY = i * SPINE_GAP;
    nodes.push({
      id: topic.id,
      type: "topic",
      position: { x: 0, y: spineY },
      data: {
        title: topic.title,
        topicType: topic.type,
        hasChildren: !!topic.children?.length,
      },
    });

    // 줄기 연결 (루트 → 첫 노드, 그 다음은 노드 → 노드)
    const prev = i === 0 ? "__root" : ROADMAP[i - 1].id;
    edges.push({
      id: `${prev}->${topic.id}`,
      source: prev,
      target: topic.id,
      sourceHandle: "b",
      targetHandle: "t",
      variant: "spine",
    });

    // 곁가지 배치
    const children = topic.children ?? [];
    const dir = topic.side === "left" ? -1 : 1;
    const totalH = (children.length - 1) * CHILD_GAP;
    children.forEach((child, k) => {
      const childY = spineY + k * CHILD_GAP - totalH / 2;
      nodes.push({
        id: child.id,
        type: "topic",
        position: { x: dir * BRANCH_DX, y: childY },
        data: {
          title: child.title,
          topicType: child.type,
          hasChildren: !!child.children?.length,
        },
      });
      edges.push({
        id: `${topic.id}->${child.id}`,
        source: topic.id,
        target: child.id,
        sourceHandle: dir === 1 ? "r" : "l",
        targetHandle: dir === 1 ? "l" : "r",
        variant: "branch",
      });
    });
  });

  return { nodes, edges };
}
