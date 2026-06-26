"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { TopicType } from "@/lib/roadmap";

const FILL: Record<TopicType, string> = {
  primary: "#fef08a", // 노랑
  secondary: "#c4b5fd", // 보라
  optional: "#e5e7eb", // 회색
};

interface Data {
  title: string;
  topicType: TopicType;
  hasChildren: boolean;
}

/** 손그림 스케치 테두리를 가진 토픽 노드 */
export function RoughNode({ data }: NodeProps) {
  const { title, topicType, hasChildren } = data as unknown as Data;
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // 콘텐츠 렌더 후 실제 크기 측정
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 측정된 크기에 맞춰 rough.js 사각형 그리기
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || size.w === 0) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const pad = 3;
    const rect = rc.rectangle(pad, pad, size.w - pad * 2, size.h - pad * 2, {
      fill: FILL[topicType],
      fillStyle: "solid",
      roughness: 1.6,
      bowing: 1.5,
      stroke: "#2b2b2b",
      strokeWidth: 2.2,
      seed: hashSeed(title),
    });
    svg.appendChild(rect);
  }, [size, topicType, title]);

  return (
    <div
      ref={wrapRef}
      className="relative inline-flex items-center justify-center px-5 py-2 cursor-pointer select-none"
      style={{
        minWidth: 120,
        maxWidth: 230,
        filter: "drop-shadow(2px 3px 0 rgba(43,43,43,0.25))",
      }}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none"
        width={size.w}
        height={size.h}
      />
      <span className="relative z-10 text-center font-hand text-[17px] leading-tight text-ink">
        {title}
      </span>

      {/* 연결용 핸들 (보이지 않게) — 사방으로 source/target 모두 제공 */}
      <Handle id="t" type="target" position={Position.Top} className="!opacity-0" />
      <Handle id="b" type="source" position={Position.Bottom} className="!opacity-0" />
      <Handle id="l" type="source" position={Position.Left} className="!opacity-0" />
      <Handle id="l" type="target" position={Position.Left} className="!opacity-0" />
      <Handle id="r" type="source" position={Position.Right} className="!opacity-0" />
      <Handle id="r" type="target" position={Position.Right} className="!opacity-0" />
    </div>
  );
}

/** 제목 기반 안정적인 시드 — 새로고침해도 같은 손그림 모양 유지 */
function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 100000;
}
