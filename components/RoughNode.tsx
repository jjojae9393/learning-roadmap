"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { TopicType } from "@/lib/roadmap";

// 분필 색상 (테두리 = 글씨색)
const CHALK: Record<TopicType, string> = {
  primary: "#f3f0e7", // 흰 분필
  secondary: "#f2e06b", // 노란 분필
  optional: "#9fc8bb", // 청록 분필
};

interface Data {
  title: string;
  topicType: TopicType;
  level: 1 | 2 | 3;
  hasChildren: boolean;
  expanded: boolean;
}

/** 칠판 위 분필로 그린 듯한 토픽 노드 (좌→우 플로우) */
export function RoughNode({ data }: NodeProps) {
  const { title, topicType, level, hasChildren, expanded } = data as unknown as Data;
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const stroke = CHALK[topicType];

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 측정된 크기에 맞춰 rough.js 분필 사각형 그리기 (채움 없이 외곽선만)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || size.w === 0) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const pad = 3;
    const rect = rc.rectangle(pad, pad, size.w - pad * 2, size.h - pad * 2, {
      stroke,
      strokeWidth: level === 3 ? 1.6 : 2.2,
      roughness: 2.2,
      bowing: 2,
      fill: "rgba(243,240,231,0.04)",
      fillStyle: "solid",
      seed: hashSeed(title),
    });
    svg.appendChild(rect);
  }, [size, stroke, level, title]);

  return (
    <div
      ref={wrapRef}
      className="relative inline-flex items-center gap-2 px-4 py-1.5 cursor-pointer select-none"
      style={{ minWidth: 96, maxWidth: 240 }}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none"
        width={size.w}
        height={size.h}
      />
      <span
        className="relative z-10 font-hand leading-tight"
        style={{
          color: stroke,
          fontSize: level === 3 ? 15 : 17,
          fontWeight: topicType === "primary" ? 700 : 400,
        }}
      >
        {title}
      </span>

      {/* 펼침/접기 표시 (자식 있을 때만) */}
      {hasChildren && (
        <span
          className="relative z-10 font-hand text-sm"
          style={{ color: stroke }}
          aria-hidden
        >
          {expanded ? "▾" : "▸"}
        </span>
      )}

      {/* 가로 플로우 연결 핸들 */}
      <Handle id="l" type="target" position={Position.Left} className="!opacity-0" />
      <Handle id="r" type="source" position={Position.Right} className="!opacity-0" />
    </div>
  );
}

/** 제목 기반 안정적인 시드 — 새로고침해도 같은 손그림 모양 유지 */
function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 100000;
}
