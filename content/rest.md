## REST API

REST(REpresentational State Transfer)는 HTTP를 활용해 자원을 다루는
가장 널리 쓰이는 API 설계 스타일입니다.

### 핵심 원칙

- **자원(Resource)** 은 URL로 표현: `/users/1`
- **행위(Verb)** 는 HTTP 메서드로 표현
- **무상태(Stateless)**: 각 요청은 독립적

### 메서드와 의미

| 메서드 | 의미 | 예시 |
| --- | --- | --- |
| GET | 조회 | `GET /users` |
| POST | 생성 | `POST /users` |
| PUT | 전체 수정 | `PUT /users/1` |
| PATCH | 부분 수정 | `PATCH /users/1` |
| DELETE | 삭제 | `DELETE /users/1` |

### 좋은 REST 설계 팁

- 동사가 아닌 **명사**로 경로를 만든다 (`/getUser` ❌ → `/users/1` ✅)
- 적절한 상태 코드를 반환한다
- 페이지네이션·필터는 쿼리스트링으로 (`/users?page=2&sort=name`)
