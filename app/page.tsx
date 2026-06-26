import { RoadmapFlow } from "@/components/RoadmapFlow";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-b-[3px] border-ink/80 px-6 py-4">
        <h1 className="font-hand text-3xl font-bold text-ink">Backend Developer</h1>
        <p className="font-hand text-lg text-ink/70">
          2026년 백엔드 개발자가 되기 위한 단계별 학습 로드맵
        </p>
      </header>

      {/* 로드맵 캔버스 */}
      <div className="relative flex-1">
        <RoadmapFlow />
      </div>
    </main>
  );
}
