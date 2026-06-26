## Git

Git은 코드의 변경 이력을 관리하는 **분산 버전 관리 시스템**입니다.
혼자 작업할 때도, 팀으로 협업할 때도 필수입니다.

### 가장 자주 쓰는 명령어

```bash
git init                 # 저장소 시작
git add .                # 변경사항 스테이징
git commit -m "메시지"    # 커밋 기록
git branch feature       # 브랜치 생성
git checkout feature     # 브랜치 이동
git merge feature        # 병합
git push origin main     # 원격 저장소로 업로드
```

### 핵심 개념

- **커밋(commit)**: 한 시점의 스냅샷
- **브랜치(branch)**: 독립적인 작업 줄기
- **머지(merge) / 리베이스(rebase)**: 갈라진 작업을 합치기
- **원격(remote)**: GitHub 등 외부 저장소
