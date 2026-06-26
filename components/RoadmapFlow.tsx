"use client";

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import { useMemo, useState } from "react";
import { buildGraph } from "@/lib/layout";
import { RoughNode } from "./RoughNode";
import { RootNode } from "./RootNode";

const nodeTypes = { topic: RoughNode, section: RootNode };

export function RoadmapFlow() {
  // 펼쳐진 대주제(2계층) id 집합. 기본: 전부 접힘(=하위 숨김)
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

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

  // 노드 클릭 = 펼침/접기 (자식 있는 대주제만). 상세는 노드 안 ⓘ 아이콘.
  const onNodeClick: NodeMouseHandler = (_, node) => {
    const data = node.data as unknown as { hasChildren: boolean; level: number };
    if (node.type === "topic" && data.hasChildren) {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) next.delete(node.id);
        else next.add(node.id);
        return next;
      });
    }
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      minZoom={0.3}
      maxZoom={1.6}
      proOptions={{ hideAttribution: true }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
    >
      <Background variant={BackgroundVariant.Dots} gap={30} size={1} color="rgba(243,240,231,0.12)" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
