// 학습 로드맵 데이터 모델
//
// 구조(3계층): 섹션(1) → 대주제(2) → 하위(3)
// - 섹션(공통 기초 / Backend / Frontend)과 대주제는 항상 표시.
// - 하위(3계층)는 대주제 클릭 시 펼쳐진다.
// - 그래프는 좌→우 가로 플로우로 렌더된다.

export type TopicType = "primary" | "required" | "secondary" | "optional";

export interface Topic {
  id: string; // URL slug 으로도 사용 (전체에서 유일해야 함)
  title: string;
  type: TopicType;
  /** 한 줄 요약 (상세 페이지가 없을 때도 사용) */
  summary?: string;
  children?: Topic[];
}

export interface Section {
  id: string;
  title: string;
  topics: Topic[]; // 대주제(2계층). 각 대주제의 children = 하위(3계층).
}

// ── 섹션 정의 ────────────────────────────────────────────────────
export const SECTIONS: Section[] = [
  {
    id: "foundation",
    title: "공통 기초",
    topics: [
      {
        id: "internet",
        title: "Internet & HTTP",
        type: "primary",
        summary: "웹이 어떻게 동작하는지 — 모든 개발의 출발점.",
        children: [
          { id: "how-internet-works", title: "인터넷의 기본", type: "required" },
          { id: "protocols-and-layers", title: "프로토콜과 계층 구조", type: "secondary" },
          { id: "what-is-http", title: "What is HTTP?", type: "required" },
          { id: "dns", title: "DNS and how it works?", type: "optional" },
        ],
      },
      {
        id: "version-control",
        title: "Version Control (Git)",
        type: "primary",
        summary: "코드 변경 이력 관리와 협업의 기본기.",
        children: [
          { id: "git", title: "Git", type: "required" },
          { id: "github", title: "GitHub", type: "secondary" },
        ],
      },
      {
        id: "cli",
        title: "Terminal & CLI",
        type: "primary",
        summary: "셸 명령어와 터미널 사용에 익숙해지기.",
      },
      {
        id: "data-structures",
        title: "Data Structures & Algorithms",
        type: "primary",
        summary: "배열·해시·트리와 시간복잡도 등 문제 해결의 토대.",
      },
    ],
  },
  /* ── Backend / Frontend 섹션: 현재 비활성화(공통 기초만 노출) ──
  {
    id: "backend",
    title: "Backend",
    topics: [
      {
        id: "pick-a-language",
        title: "Pick a Backend Language",
        type: "primary",
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
        id: "relational-databases",
        title: "Relational Databases",
        type: "primary",
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
        summary: "사용자가 누구인지 확인하고 권한을 부여하는 방법.",
        children: [
          { id: "jwt", title: "JWT", type: "secondary" },
          { id: "oauth", title: "OAuth", type: "secondary" },
        ],
      },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    topics: [
      {
        id: "fe-html",
        title: "HTML",
        type: "primary",
        summary: "웹 문서의 뼈대를 만드는 마크업 언어.",
        children: [
          { id: "fe-semantic-html", title: "Writing Semantic HTML", type: "secondary" },
          { id: "fe-forms", title: "Forms and Validations", type: "secondary" },
          { id: "fe-accessibility", title: "Accessibility", type: "optional" },
        ],
      },
      {
        id: "fe-css",
        title: "CSS",
        type: "primary",
        summary: "레이아웃과 스타일을 입히는 언어.",
        children: [
          { id: "fe-layouts", title: "Making Layouts", type: "secondary" },
          { id: "fe-responsive", title: "Responsive Design", type: "secondary" },
          { id: "fe-box-model", title: "Box Model", type: "optional" },
        ],
      },
      {
        id: "fe-javascript",
        title: "JavaScript",
        type: "primary",
        summary: "웹에 동작을 부여하는 핵심 언어.",
        children: [
          { id: "fe-dom", title: "DOM Manipulation", type: "secondary" },
          { id: "fe-fetch", title: "Fetch API / Ajax", type: "secondary" },
          { id: "fe-es6", title: "ES6+ and Modules", type: "secondary" },
        ],
      },
      {
        id: "fe-framework",
        title: "Pick a Framework",
        type: "primary",
        summary: "컴포넌트 기반 UI 프레임워크 하나를 골라 익히기.",
        children: [
          { id: "fe-react", title: "React.js", type: "secondary" },
          { id: "fe-vue", title: "Vue.js", type: "secondary" },
          { id: "fe-angular", title: "Angular", type: "optional" },
        ],
      },
      {
        id: "fe-css-frameworks",
        title: "CSS Frameworks",
        type: "primary",
        summary: "빠른 스타일링을 돕는 CSS 프레임워크.",
        children: [
          { id: "fe-tailwind", title: "Tailwind CSS", type: "secondary" },
          { id: "fe-bootstrap", title: "Bootstrap", type: "optional" },
        ],
      },
    ],
  },
  */
];

// ── 파생 유틸────────────────────────────────────────────────────

/** id → Topic 평탄화 인덱스 (모든 섹션/깊이) */
const index: Record<string, Topic> = {};
function walk(topics: Topic[]) {
  for (const t of topics) {
    index[t.id] = t;
    if (t.children) walk(t.children);
  }
}
SECTIONS.forEach((s) => walk(s.topics));

export function getTopic(id: string): Topic | undefined {
  return index[id];
}

export function getChildren(id: string): Topic[] {
  return index[id]?.children ?? [];
}

export function allTopicIds(): string[] {
  return Object.keys(index);
}
