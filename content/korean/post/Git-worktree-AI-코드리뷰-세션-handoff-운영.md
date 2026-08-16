---
layout: post
title: "Git worktree·AI 코드리뷰·세션 handoff 운영"
description: "Zed와 Codex를 사용하는 개발 작업의 분리·검증·인계 원칙"
categories: [개발, AI]
tags: [git, worktree, zed, codex, code-review, session-handoff]
publishdate: 2026-08-16
draft: false
---

# 결론

개발 작업은 **프로젝트 규칙 확인 → 작업별 worktree/branch 분리 → 읽기 전용 AI 리뷰 → 사람이 승인한 수정 → 테스트·검증 → handoff 기록** 순서로 운영한다. 리뷰 agent와 수정 agent를 같은 세션에 섞지 않아야 자동 수정과 판단이 뒤섞이지 않는다.

## 운영 흐름

```text
작업 정의
  → AGENTS.md/CODE_REVIEW.md와 현재 branch 확인
  → 기능·리뷰·실험별 worktree 분리
  → diff와 caller/callee, 설정·SQL·테스트 확인
  → Critical/Major/Minor 리뷰
  → false positive 재검증
  → 승인 항목만 수정
  → build/test/lint
  → handoff 기록
```

## Git worktree 원칙

- 주 작업 디렉터리는 보존하고 병렬 작업은 별도 worktree에서 수행한다.
- worktree 이름에 목적과 상태를 넣는다. 예: `review/<topic>`, `fix/<issue>`.
- 시작 시 base commit, branch, 변경 범위, 검증 명령을 기록한다.
- 미커밋 변경과 untracked 파일을 먼저 확인하고 자동 정리하지 않는다.
- 완료 후 diff와 검증 결과를 남긴 뒤 worktree 제거는 별도로 확인한다.

## AI 코드리뷰 규칙

리뷰 agent는 기본적으로 파일을 수정하지 않는다. 실제 버그·회귀, 예외·rollback, transaction·concurrency, DB 성능, 데이터 정합성, 인증·인가, timeout·retry, 테스트 누락 순으로 확인한다.

diff만 보지 않고 Controller → Service → Repository/Mapper → SQL → 외부 API까지 필요한 흐름을 추적한다. 사람이 승인하지 않은 제안은 수정 작업으로 넘기지 않는다.

## 세션 handoff 필수 항목

- 목적과 현재 상태
- 작업 디렉터리·branch·base commit
- 변경·미변경 파일
- 확인된 사실과 미확인 항목
- 실행한 명령과 결과
- 남은 위험과 차단 요소
- 다음 agent가 첫 번째로 할 일
- 사용자 결정 사항

## 후속 TODO

- 공통 handoff 템플릿 위치 결정
- 자주 쓰는 저장소 2~3곳의 worktree·검증 명령 비교
- Zed 설정과 repository-local AGENTS.md 우선순위 검증
