## HTTP란?

HTTP(HyperText Transfer Protocol)는 웹에서 클라이언트(브라우저)와 서버가
데이터를 주고받기 위한 **요청–응답 기반 프로토콜**입니다.

### 요청(Request) 구조

```http
GET /api/users/1 HTTP/1.1
Host: example.com
Accept: application/json
```

- **메서드**: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- **경로**: 어떤 리소스를 원하는지
- **헤더**: 부가 정보(인증, 콘텐츠 타입 등)

### 응답(Response) 구조

```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "id": 1, "name": "Jaewon" }
```

### 자주 쓰는 상태 코드

- `200` OK — 성공
- `201` Created — 생성됨
- `400` Bad Request — 잘못된 요청
- `401` Unauthorized — 인증 필요
- `404` Not Found — 리소스 없음
- `500` Internal Server Error — 서버 오류
