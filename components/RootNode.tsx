"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

/** 섹션(1계층) 라벨 노드 — 칠판 위 큰 분필 글씨 */
export function RootNode({ data }: NodeProps) {
  const { title } = data as unknown as { title: string };
  return (
    <div className="relative select-none">
      <span
        className="font-hand text-3xl font-bold"
        style={{
          color: "#f3f0e7",
          textShadow: "0 0 1px rgba(243,240,231,0.6)",
        }}
      >
        {title}
      </span>
      <Handle id="r" type="source" position={Position.Right} className="!opacity-0" />
    </div>
  );
}
