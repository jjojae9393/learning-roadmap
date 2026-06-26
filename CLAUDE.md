# CLAUDE.md

이 저장소에서 작업할 때 따라야 할 프로젝트 지침.

## Next.js

이 프로젝트의 Next.js는 학습 데이터와 다를 수 있는 breaking change 가 있는 버전입니다.
코드를 작성하기 전에 `node_modules/next/dist/docs/` 의 관련 문서를 확인하고, deprecation 경고를 따르세요.

## 작업 방식

- **페이지 로드/배포 결과를 매번 확인하지 말 것.** 변경 후 로컬 dev 서버나 배포된 GitHub Pages 사이트를
  `curl` 등으로 일일이 열어보며 검증하지 않는다. 빌드 성공 여부로 충분하며, 동작 확인이 꼭 필요하면
  사용자가 직접 요청할 때만 한다.
