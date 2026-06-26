"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTopic, type TopicType } from "@/lib/roadmap";

const CHALK: Record<TopicType, string> = {
  primary: "#f3f0e7",
  secondary: "#f2e06b",
  optional: "#9fc8bb",
};
const BADGE: Record<TopicType, string> = {
  primary: "핵심",
  secondary: "추천",
  optional: "선택",
};

const MIN_WIDTH = 450; // 최소 너비

/** 3계층 노드 클릭 시 우측에 펼쳐지는 판서(상세) 패널 — 좌측 경계 드래그로 너비 조절 */
export function DetailPanel({
  topicId,
  contents,
  onClose,
}: {
  topicId: string | null;
  contents: Record<string, string>;
  onClose: () => void;
}) {
  const open = !!topicId;
  const topic = topicId ? getTopic(topicId) : undefined;
  const content = topicId ? contents[topicId] : undefined;
  const color = topic ? CHALK[topic.type] : "#f3f0e7";

  const asideRef = useRef<HTMLElement>(null);
  const dragging = useRef(false);
  const [width, setWidth] = useState(MIN_WIDTH);
  const [resizing, setResizing] = useState(false);

  const onMove = useCallback((e: PointerEvent) => {
    if (!dragging.current || !asideRef.current) return;
    const right = asideRef.current.getBoundingClientRect().right;
    const max = window.innerWidth - 80;
    setWidth(Math.max(MIN_WIDTH, Math.min(right - e.clientX, max)));
  }, []);

  const onUp = useCallback(() => {
    dragging.current = false;
    setResizing(false);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  }, [onMove]);

  const onHandleDown = (e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    setResizing(true);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [onMove, onUp]);

  return (
    <aside
      ref={asideRef}
      style={{ width }}
      className={`absolute right-0 top-0 z-30 flex h-full max-w-[92%] flex-col border-l-2 border-dashed border-chalk/40 bg-black/25 backdrop-blur-[1px] ${
        resizing ? "" : "transition-transform duration-300"
      } ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* 좌측 리사이즈 핸들 */}
      <div
        onPointerDown={onHandleDown}
        className="group absolute left-0 top-0 z-40 h-full w-2 -translate-x-1/2 cursor-col-resize"
        title="드래그하여 너비 조절"
      >
        <div className="mx-auto h-full w-[3px] bg-chalk/0 transition-colors group-hover:bg-chalk/50" />
      </div>

      {topic && (
        <>
          <div className="flex items-start justify-between gap-3 px-6 pt-6">
            <div>
              <span
                className="inline-block rounded-md border-2 px-2 py-0.5 font-hand text-sm"
                style={{ color, borderColor: color }}
              >
                {BADGE[topic.type]}
              </span>
              <h2 className="mt-2 font-hand text-3xl font-bold" style={{ color }}>
                {topic.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              title="닫기"
              className="font-hand text-2xl text-chalk/70 hover:text-chalk"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
            {topic.summary && (
              <p className="mb-4 font-hand text-lg text-chalk/80">{topic.summary}</p>
            )}
            {content ? (
              <article className="markdown font-hand text-[17px] leading-relaxed text-chalk">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </article>
            ) : (
              <p className="font-hand text-base text-chalk/50">
                상세 내용은 아직 준비 중입니다.
              </p>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
