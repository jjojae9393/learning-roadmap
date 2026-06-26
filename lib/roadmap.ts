// 학습 로드맵 데이터 모델
//
// - Topic: 하나의 학습 주제. 트리 구조(children)로 상위/하위를 표현.
// - Roadmap: 여러 개의 로드맵(Backend, Frontend ...)을 나란히 둔다.
// - 메인 줄기(spine)는 세로로 이어지고, 각 줄기의 children은 좌/우로 가지치기.
// - 그래프(노드/엣지)는 이 트리에서 자동 생성한다.

export type TopicType = "primary" | "secondary" | "optional";

export interface Topic {
  id: string; // URL slug 으로도 사용 (로드맵 간 유일해야 함)
  title: string;
  type: TopicType;
  /** 그래프에서 자식 노드를 어느 쪽에 배치할지 */
  side?: "left" | "right";
  /** 한 줄 요약 (상세 페이지가 없을 때도 사용) */
  summary?: string;
  children?: Topic[];
}

export interface Roadmap {
  id: string;
  title: string;
  topics: Topic[];
}

// ── Backend 로드맵 ────────────────────────────────────────────────
const BACKEND: Topic[] = [
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

// ── Frontend 로드맵 (이미지 기반 간략 샘플) ─────────────────────────
const FRONTEND: Topic[] = [
  {
    id: "fe-internet",
    title: "Internet",
    type: "primary",
    side: "right",
    summary: "인터넷과 브라우저가 동작하는 기본 원리.",
    children: [
      { id: "fe-how-internet-works", title: "How does the internet work?", type: "secondary" },
      { id: "fe-http", title: "What is HTTP?", type: "secondary" },
      { id: "fe-browsers", title: "Browsers and how they work?", type: "secondary" },
    ],
  },
  {
    id: "fe-html",
    title: "HTML",
    type: "primary",
    side: "left",
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
    side: "right",
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
    side: "left",
    summary: "웹에 동작을 부여하는 핵심 언어.",
    children: [
      { id: "fe-dom", title: "DOM Manipulation", type: "secondary" },
      { id: "fe-fetch", title: "Fetch API / Ajax", type: "secondary" },
      { id: "fe-es6", title: "ES6+ and Modules", type: "secondary" },
    ],
  },
  {
    id: "fe-version-control",
    title: "Version Control Systems",
    type: "primary",
    side: "right",
    summary: "코드 변경 이력 관리와 협업.",
    children: [
      { id: "fe-git", title: "Git", type: "secondary" },
      { id: "fe-github", title: "GitHub", type: "secondary" },
    ],
  },
  {
    id: "fe-package-managers",
    title: "Package Managers",
    type: "primary",
    side: "left",
    summary: "의존성 설치/관리 도구. npm, yarn, pnpm.",
    children: [
      { id: "fe-npm", title: "npm", type: "secondary" },
      { id: "fe-yarn", title: "yarn", type: "optional" },
    ],
  },
  {
    id: "fe-framework",
    title: "Pick a Framework",
    type: "primary",
    side: "right",
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
    side: "left",
    summary: "빠른 스타일링을 돕는 CSS 프레임워크.",
    children: [
      { id: "fe-tailwind", title: "Tailwind CSS", type: "secondary" },
      { id: "fe-bootstrap", title: "Bootstrap", type: "optional" },
    ],
  },
  {
    id: "fe-testing",
    title: "Testing your Apps",
    type: "primary",
    side: "right",
    summary: "Unit / Integration / Functional 테스트로 품질 확보.",
    children: [
      { id: "fe-jest", title: "Jest", type: "secondary" },
      { id: "fe-cypress", title: "Cypress", type: "secondary" },
    ],
  },
];

// ── 로드맵 목록 (나란히 표시) ───────────────────────────────────────
export const ROADMAPS: Roadmap[] = [
  { id: "backend", title: "Backend", topics: BACKEND },
  { id: "frontend", title: "Frontend", topics: FRONTEND },
];

// ── 파생 유틸 ────────────────────────────────────────────────────

/** id → Topic 평탄화 인덱스 (모든 로드맵/깊이) */
const index: Record<string, Topic> = {};
function walk(topics: Topic[]) {
  for (const t of topics) {
    index[t.id] = t;
    if (t.children) walk(t.children);
  }
}
ROADMAPS.forEach((r) => walk(r.topics));

export function getTopic(id: string): Topic | undefined {
  return index[id];
}

export function getChildren(id: string): Topic[] {
  return index[id]?.children ?? [];
}

export function allTopicIds(): string[] {
  return Object.keys(index);
}
