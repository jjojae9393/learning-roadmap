"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { getTopic, type TopicType } from "@/lib/roadmap";

/** 제목 텍스트 → id 슬러그 (한글 유지) */
function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣-]/g, "");
}

/** ReactMarkdown children(문자열/배열/엘리먼트)을 평문으로 평탄화 */
function nodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (node && typeof node === "object" && "props" in node)
    return nodeText((node as { props: { children?: React.ReactNode } }).props.children);
  return "";
}

/** ReactMarkdown 렌더러 — h2에 목차 이동용 id 부여. 모듈 상수로 두어 리렌더 시 마크다운이 재렌더되지 않게 한다 */
const MD_COMPONENTS = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 id={slugify(nodeText(children))}>{children}</h2>
  ),
} as const;

const CHALK: Record<TopicType, string> = {
  primary: "#f3f0e7",
  required: "#ec5a87",
  secondary: "#f2e06b",
  optional: "#9fc8bb",
};
const BADGE: Record<TopicType, string> = {
  primary: "핵심",
  required: "필수",
  secondary: "추천",
  optional: "선택",
};

export const MIN_PANEL_WIDTH = 500; // 최소 너비

/** 3계층 노드 클릭 시 우측에 펼쳐지는 판서(상세) 패널 — 좌측 경계 드래그로 너비 조절 */
export function DetailPanel({
  topicId,
  contents,
  onClose,
  width,
  onWidthChange,
}: {
  topicId: string | null;
  contents: Record<string, string>;
  onClose: () => void;
  width: number;
  onWidthChange: (w: number) => void;
}) {
  const open = !!topicId;
  const topic = topicId ? getTopic(topicId) : undefined;
  const content = topicId ? contents[topicId] : undefined;
  const color = topic ? CHALK[topic.type] : "#f3f0e7";

  const asideRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [resizing, setResizing] = useState(false);
  const [activeId, setActiveId] = useState("");

  // 콘텐츠의 ## 제목들을 목차로 추출 (코드블록 내부는 제외)
  const headings = useMemo(() => {
    if (!content) return [];
    let inFence = false;
    const items: { text: string; id: string }[] = [];
    for (const line of content.split("\n")) {
      if (line.trimStart().startsWith("```")) inFence = !inFence;
      if (inFence) continue;
      if (line.startsWith("## ")) {
        const text = line.slice(3).trim();
        items.push({ text, id: slugify(text) });
      }
    }
    return items;
  }, [content]);

  // 목차 클릭 → 해당 제목으로 스크롤 (스크롤 컨테이너 기준)
  const goTo = (id: string) => {
    const c = scrollRef.current;
    if (!c) return;
    const el = c.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop;
    c.scrollTo({ top: top - 12, behavior: "smooth" });
  };

  // 주제가 바뀌면 스크롤 위치를 맨 위로 초기화
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [topicId]);

  // 스크롤 스파이 — 기준선보다 위에 있는 마지막 제목을 목차에서 강조
  useEffect(() => {
    const c = scrollRef.current;
    if (!c || headings.length < 2) return;

    const update = () => {
      const cTop = c.getBoundingClientRect().top;
      const line = 96; // 컨테이너 상단에서 96px 지점을 활성 기준선으로
      let current = headings[0].id;
      for (const h of headings) {
        // 매번 새로 조회 — 리렌더로 노드가 교체돼도 항상 살아있는 요소를 측정
        const el = c.querySelector<HTMLElement>(`#${CSS.escape(h.id)}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top - cTop <= line) current = h.id;
        else break;
      }
      // 맨 아래까지 스크롤하면 마지막 섹션을 활성으로
      if (c.scrollTop + c.clientHeight >= c.scrollHeight - 4) {
        current = headings[headings.length - 1].id;
      }
      setActiveId(current);
    };

    update();
    c.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update); // 패널 너비 변경 등 레이아웃 변동 시 재계산
    ro.observe(c);
    return () => {
      c.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [topicId, headings]);

  const onMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging.current || !asideRef.current) return;
      const right = asideRef.current.getBoundingClientRect().right;
      const max = window.innerWidth - 80;
      onWidthChange(Math.max(MIN_PANEL_WIDTH, Math.min(right - e.clientX, max)));
    },
    [onWidthChange],
  );

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

          <div className="flex min-h-0 flex-1">
            {headings.length >= 2 && (
              <nav className="w-44 shrink-0 overflow-y-auto border-r border-dashed border-chalk/25 py-4 pl-6 pr-3">
                <p className="mb-2 font-hand text-xs uppercase tracking-wide text-chalk/45">
                  목차
                </p>
                <ul className="space-y-1.5">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <button
                        onClick={() => goTo(h.id)}
                        className={`block border-l-2 pl-2 text-left font-hand text-[13px] leading-snug underline-offset-2 transition-colors hover:text-chalk ${
                          activeId === h.id
                            ? "border-chalk font-bold text-chalk"
                            : "border-transparent text-chalk/65 hover:underline"
                        }`}
                      >
                        {h.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
              {topic.summary && (
                <p className="mb-4 font-hand text-lg text-chalk/80">{topic.summary}</p>
              )}
              {content ? (
                <article className="markdown font-hand text-[17px] leading-relaxed text-chalk">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={MD_COMPONENTS}
                  >
                    {content}
                  </ReactMarkdown>
                </article>
              ) : (
                <p className="font-hand text-base text-chalk/50">
                  상세 내용은 아직 준비 중입니다.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
