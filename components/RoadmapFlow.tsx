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
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { buildGraph } from "@/lib/layout";
import { RoughNode } from "./RoughNode";
import { RootNode } from "./RootNode";

const nodeTypes = { topic: RoughNode, root: RootNode };

export function RoadmapFlow() {
  const router = useRouter();
  const { nodes, edges } = useMemo(() => {
    const g = buildGraph();
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
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
      type: e.variant === "spine" ? "default" : "smoothstep",
      style: {
        stroke: "#2b2b2b",
        strokeWidth: 2,
        strokeDasharray: e.variant === "branch" ? "1 7" : undefined,
        strokeLinecap: "round" as const,
      },
    }));
    return { nodes: ns, edges: es };
  }, []);

  const onNodeClick: NodeMouseHandler = (_, node) => {
    if (node.type === "topic") router.push(`/topic/${node.id}`);
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.3}
      maxZoom={1.6}
      proOptions={{ hideAttribution: true }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
    >
      <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#d8cfb4" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
