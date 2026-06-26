import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { allTopicIds, getChildren, getTopic, type TopicType } from "@/lib/roadmap";
import { getContent } from "@/lib/content";

export function generateStaticParams() {
  return allTopicIds().map((slug) => ({ slug }));
}

const BADGE: Record<TopicType, { label: string; cls: string }> = {
  primary: { label: "핵심", cls: "bg-topic-primary" },
  secondary: { label: "추천", cls: "bg-topic-secondary" },
  optional: { label: "선택", cls: "bg-topic-optional" },
};

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const content = getContent(slug);
  const children = getChildren(slug);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
      <Link
        href="/"
        className="font-hand text-lg text-ink/60 hover:text-accent"
      >
        ← 로드맵으로
      </Link>

      <header className="mt-4 mb-8">
        <span
          className={`inline-block rounded-md border-2 border-ink px-2 py-0.5 font-hand text-sm ${BADGE[topic.type].cls}`}
        >
          {BADGE[topic.type].label}
        </span>
        <h1 className="mt-3 font-hand text-4xl font-bold text-ink">{topic.title}</h1>
        {topic.summary && (
          <p className="mt-2 font-hand text-xl text-ink/70">{topic.summary}</p>
        )}
      </header>

      {/* 상세 콘텐츠 (마크다운) */}
      {content && (
        <article className="markdown font-hand text-lg leading-relaxed text-ink">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      )}

      {!content && !children.length && (
        <p className="font-hand text-lg text-ink/50">
          아직 작성된 상세 내용이 없습니다.
        </p>
      )}

      {/* 하위 주제 목록 */}
      {children.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-hand text-2xl font-bold text-ink">하위 주제</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {children.map((child) => (
              <li key={child.id}>
                <Link
                  href={`/topic/${child.id}`}
                  className={`block rounded-xl border-[3px] border-ink px-4 py-3 font-hand text-lg text-ink shadow-[3px_4px_0_rgba(43,43,43,0.25)] transition-transform hover:-translate-y-0.5 ${BADGE[child.type].cls}`}
                >
                  <span className="block font-bold">{child.title}</span>
                  {child.summary && (
                    <span className="text-base text-ink/70">{child.summary}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
