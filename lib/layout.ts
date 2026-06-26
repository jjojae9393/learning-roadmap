// 로드맵 데이터 → React Flow 노드/엣지 좌표 변환
//
// 좌→우 가로 플로우:
//   [섹션(1)]  →  [대주제(2)]  →  [하위(3), 펼침 시에만]
// 섹션/대주제는 항상 표시, 하위는 expanded 에 포함된 대주제에 한해 표시.
import { SECTIONS, type Topic, type TopicType } from "./roadmap";

export interface FlowNode {
  id: string;
  type: "topic" | "section";
  position: { x: number; y: number };
  data: {
    title: string;
    topicType: TopicType;
    level: 1 | 2 | 3;
    hasChildren: boolean;
    expanded: boolean;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  variant: "section" | "branch";
}

const COL_SECTION = 0; // 1계층 x
const COL_TOPIC = 360; // 2계층 x
const COL_CHILD = 740; // 3계층 x
const ROW_GAP = 96; // 대주제 세로 간격
const CHILD_ROW_GAP = 64; // 하위 세로 간격
const SECTION_GAP = 70; // 섹션 사이 여백

export function buildGraph(expanded: Set<string>): {
  nodes: FlowNode[];
  edges: FlowEdge[];
} {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  let y = 0;

  for (const section of SECTIONS) {
    const startY = y;

    for (const topic of section.topics) {
      const topicY = y;
      const hasChildren = !!topic.children?.length;
      const isOpen = expanded.has(topic.id);

      nodes.push({
        id: topic.id,
        type: "topic",
        position: { x: COL_TOPIC, y: topicY },
        data: {
          title: topic.title,
          topicType: topic.type,
          level: 2,
          hasChildren,
          expanded: isOpen,
        },
      });
      edges.push({
        id: `${section.id}->${topic.id}`,
        source: `__section_${section.id}`,
        target: topic.id,
        variant: "section",
      });
      y += ROW_GAP;

      // 하위(3계층): 펼쳐진 대주제만
      if (isOpen && topic.children) {
        for (const child of topic.children) {
          nodes.push({
            id: child.id,
            type: "topic",
            position: { x: COL_CHILD, y },
            data: {
              title: child.title,
              topicType: child.type,
              level: 3,
              hasChildren: false,
              expanded: false,
            },
          });
          edges.push({
            id: `${topic.id}->${child.id}`,
            source: topic.id,
            target: child.id,
            variant: "branch",
          });
          y += CHILD_ROW_GAP;
        }
        y += ROW_GAP - CHILD_ROW_GAP; // 다음 대주제와의 여백
      }
    }

    const endY = y;
    // 섹션(1계층) 노드는 자기 대주제 블록의 세로 중앙에 배치
    nodes.push({
      id: `__section_${section.id}`,
      type: "section",
      position: { x: COL_SECTION, y: (startY + endY - ROW_GAP) / 2 },
      data: {
        title: section.title,
        topicType: "primary",
        level: 1,
        hasChildren: true,
        expanded: true,
      },
    });

    y = endY + SECTION_GAP;
  }

  return { nodes, edges };
}
