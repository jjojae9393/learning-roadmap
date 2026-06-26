# Good Developer — 개발 학습 로드맵

> 더 나은 개발자가 되기 위한 단계별 개발 학습 로드맵

[roadmap.sh](https://roadmap.sh) 스타일의 학습 로드맵을 **카툰(손그림) 느낌**으로 보여주는 페이지입니다.
학습 주제를 노드 그래프로 한눈에 보고, 노드를 클릭하면 해당 주제의 상세 페이지로 이동합니다.
하위 주제가 있으면 상세 페이지 하단에 카드로 나열됩니다.

🔗 **라이브:** [jjojae9393.github.io/learning-roadmap](https://jjojae9393.github.io/learning-roadmap/)

## 로드맵 구조

역할별로 분리하면 Git·HTTP 같은 공통 주제가 중복되므로, **공통 기초 → 역할 분기** 구조를 사용합니다.

```text
            [ 공통 기초 ]
   Internet & HTTP · Git · CLI · 자료구조
                  │
          ┌───────┴───────┐
      [Backend]        [Frontend]
   언어·DB·API·캐싱·인증   HTML·CSS·JS·프레임워크
```

- **공통 기초(Foundation)**: 모든 개발자가 함께 배우는 토대. 한 번만 정의.
- **트랙(Track)**: 역할별 특화 주제. 현재 Backend / Frontend.

## 기술 스택

- **[Next.js](https://nextjs.org) 16** (App Router) — 정적 사이트로 export
- **[React Flow](https://reactflow.dev) (`@xyflow/react`)** — 로드맵 노드/엣지 그래프
- **[Rough.js](https://roughjs.com)** — 노드의 손그림 스케치 테두리
- **Tailwind CSS v4** + 손글씨 폰트(Gaegu / Patrick Hand)
- **react-markdown** — 주제 상세 콘텐츠(마크다운) 렌더링

## 실행

패키지 매니저는 **pnpm** 을 사용합니다.

```bash
pnpm install
pnpm dev      # 개발 서버 (http://localhost:3000)
pnpm build    # 정적 사이트 빌드 → out/
```

## 콘텐츠 추가하기

코드/데이터 파일로 로드맵을 관리합니다.

| 무엇 | 어디 |
| --- | --- |
| 주제 트리(공통 기초 · 트랙) | [`lib/roadmap.ts`](lib/roadmap.ts) |
| 그래프 좌표 자동 배치 | [`lib/layout.ts`](lib/layout.ts) |
| 주제 상세 본문 | `content/<주제 id>.md` |

`lib/roadmap.ts` 에 주제를 추가하면 그래프와 상세 페이지가 자동 생성됩니다.
`content/` 에 같은 id 의 `.md` 파일을 두면 상세 본문이 표시되고, 없으면 요약 + 하위 주제 목록만 표시됩니다.

## 배포

`main` 브랜치에 푸시하면 GitHub Actions([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))가
자동으로 빌드해 GitHub Pages 에 배포합니다.
