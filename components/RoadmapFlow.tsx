"use client";

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type FitViewOptions,
} from "@xyflow/react";
import { useMemo, useState } from "react";
import { buildGraph } from "@/lib/layout";
import { RoughNode } from "./RoughNode";
import { RootNode } from "./RootNode";
import { DetailPanel, MIN_PANEL_WIDTH } from "./DetailPanel";

const nodeTypes = { topic: RoughNode, section: RootNode };

export function RoadmapFlow({ contents }: { contents: Record<string, string> }) {
  // 펼쳐진 대주제(2계층) id 집합. 기본: 전부 접힘(=하위 숨김)
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  // 우측 패널에 표시 중인 3계층 토픽 id
  const [selected, setSelected] = useState<string | null>(null);
  // 우측 판서 패널 너비 (Fit View 패딩 계산에도 사용)
  const [panelWidth, setPanelWidth] = useState(MIN_PANEL_WIDTH);

  // 패널이 열려 있으면 그 너비만큼 우측 패딩 → Fit View 가 패널 왼쪽 영역에 맞춰짐
  const fitViewOptions = useMemo<FitViewOptions>(
    () =>
      selected
        ? {
            padding: {
              top: "48px",
              bottom: "48px",
              left: "48px",
              right: `${panelWidth + 32}px`,
            },
          }
        : { padding: 0.15 },
    [selected, panelWidth],
  );

  const { nodes, edges } = useMemo(() => {
    const g = buildGraph(expanded);
    const ns: Node[] = g.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    }));
    const es: Edge[] = g.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: "r",
      targetHandle: "l",
      type: "smoothstep",
      style: {
        stroke: "#f3f0e7",
        strokeWidth: 1.6,
        strokeOpacity: e.variant === "section" ? 0.75 : 0.5,
        strokeDasharray: e.variant === "branch" ? "2 6" : undefined,
        strokeLinecap: "round" as const,
      },
    }));
    return { nodes: ns, edges: es };
  }, [expanded]);

  const onNodeClick: NodeMouseHandler = (_, node) => {
    const data = node.data as unknown as { hasChildren: boolean; level: number };
    if (node.type !== "topic") return;
    if (data.level === 2 && data.hasChildren) {
      // 대주제: 하위(3계층) 펼침/접기
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) next.delete(node.id);
        else next.add(node.id);
        return next;
      });
    } else if (data.level === 3) {
      // 하위: 우측 판서 패널로 상세 표시
      setSelected(node.id);
    }
  };

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={() => setSelected(null)}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.3}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={30}
          size={1}
          color="rgba(243,240,231,0.12)"
        />
        <Controls showInteractive={false} fitViewOptions={fitViewOptions} />
      </ReactFlow>

      <DetailPanel
        topicId={selected}
        contents={contents}
        onClose={() => setSelected(null)}
        width={panelWidth}
        onWidthChange={setPanelWidth}
      />
    </div>
  );
}
