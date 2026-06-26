"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

/** 로드맵 최상단 타이틀 노드 */
export function RootNode({ data }: NodeProps) {
  const { title } = data as unknown as { title: string };
  return (
    <div className="relative select-none">
      <span className="font-hand text-4xl font-bold text-ink">{title}</span>
      <Handle id="b" type="source" position={Position.Bottom} className="!opacity-0" />
    </div>
  );
}
