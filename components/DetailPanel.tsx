"use client";

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

/** 3계층 노드 클릭 시 우측에 펼쳐지는 판서(상세) 패널 */
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

  return (
    <aside
      className={`absolute right-0 top-0 z-30 flex h-full w-[min(440px,46%)] flex-col border-l-2 border-dashed border-chalk/40 bg-black/25 backdrop-blur-[1px] transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
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
