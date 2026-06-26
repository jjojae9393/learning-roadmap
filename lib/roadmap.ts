// 학습 로드맵 데이터 모델
//
// - Topic: 하나의 학습 주제. 트리 구조(children)로 상위/하위를 표현.
// - 메인 줄기(spine)는 세로로 이어지고, 각 줄기의 children은 좌/우로 가지치기.
// - 그래프(노드/엣지)는 이 트리에서 자동 생성한다.

export type TopicType = "primary" | "secondary" | "optional";

export interface Topic {
  id: string; // URL slug 으로도 사용
  title: string;
  type: TopicType;
  /** 그래프에서 자식 노드를 어느 쪽에 배치할지 */
  side?: "left" | "right";
  /** 한 줄 요약 (상세 페이지가 없을 때도 사용) */
  summary?: string;
  children?: Topic[];
}

// ── 로드맵 트리 정의 ──────────────────────────────────────────────
// 메인 줄기 = 최상위 배열. 각 항목의 children = 곁가지(하위 주제).
export const ROADMAP: Topic[] = [
  {
    id: "introduction",
    title: "Introduction",
    type: "primary",
    side: "right",
    summary: "백엔드 개발이 무엇이고 웹이 어떻게 동작하는지부터.",
    children: [
      { id: "how-internet-works", title: "How does the internet work?", type: "secondary" },
      { id: "what-is-http", title: "What is HTTP?", type: "secondary" },
      { id: "dns", title: "DNS and how it works?", type: "secondary" },
      { id: "hosting", title: "What is hosting?", type: "optional" },
    ],
  },
  {
    id: "pick-a-language",
    title: "Pick a Backend Language",
    type: "primary",
    side: "left",
    summary: "언어 하나를 골라 깊게 파고 프로젝트를 많이 만들어 보세요.",
    children: [
      { id: "javascript", title: "JavaScript", type: "secondary" },
      { id: "python", title: "Python", type: "secondary" },
      { id: "go", title: "Go", type: "secondary" },
      { id: "java", title: "Java", type: "optional" },
      { id: "rust", title: "Rust", type: "optional" },
    ],
  },
  {
    id: "version-control",
    title: "Version Control Systems",
    type: "primary",
    side: "right",
    summary: "코드 변경 이력 관리. 협업의 기본기.",
    children: [
      { id: "git", title: "Git", type: "secondary" },
      { id: "github", title: "GitHub", type: "secondary" },
    ],
  },
  {
    id: "relational-databases",
    title: "Relational Databases",
    type: "primary",
    side: "left",
    summary: "표 형태로 데이터를 다루는 관계형 데이터베이스.",
    children: [
      { id: "postgresql", title: "PostgreSQL", type: "secondary" },
      { id: "mysql", title: "MySQL", type: "secondary" },
      { id: "sqlite", title: "SQLite", type: "optional" },
    ],
  },
  {
    id: "apis",
    title: "Learn about APIs",
    type: "primary",
    side: "right",
    summary: "서비스 간 통신 방식. REST, GraphQL, gRPC 등.",
    children: [
      { id: "rest", title: "REST", type: "secondary" },
      { id: "graphql", title: "GraphQL", type: "secondary" },
      { id: "grpc", title: "gRPC", type: "optional" },
    ],
  },
  {
    id: "caching",
    title: "Caching",
    type: "primary",
    side: "left",
    summary: "반복 요청을 빠르게 — 서버/클라이언트/CDN 캐싱.",
    children: [
      { id: "redis", title: "Redis", type: "secondary" },
      { id: "memcached", title: "Memcached", type: "optional" },
    ],
  },
  {
    id: "authentication",
    title: "Authentication",
    type: "primary",
    side: "right",
    summary: "사용자가 누구인지 확인하고 권한을 부여하는 방법.",
    children: [
      { id: "jwt", title: "JWT", type: "secondary" },
      { id: "oauth", title: "OAuth", type: "secondary" },
    ],
  },
];

// ── 파생 유틸 ────────────────────────────────────────────────────

/** id → Topic 평탄화 인덱스 (모든 깊이) */
const index: Record<string, Topic> = {};
function walk(topics: Topic[]) {
  for (const t of topics) {
    index[t.id] = t;
    if (t.children) walk(t.children);
  }
}
walk(ROADMAP);

export function getTopic(id: string): Topic | undefined {
  return index[id];
}

export function getChildren(id: string): Topic[] {
  return index[id]?.children ?? [];
}

export function allTopicIds(): string[] {
  return Object.keys(index);
}
