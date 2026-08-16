---
layout: post
title: "AI 읽을거리에서 역사 추론 프로젝트로"
description: "Agent 구조의 변화와 역사 사료·유물·지도 연구 아이디어의 연결"
categories: [AI, 역사]
tags: [agent, digital-humanities, knowledge-graph, gis, history]
publishdate: 2026-08-16
draft: false
---

# 핵심 결론

최근 읽을거리의 핵심은 모델 자체보다 **모델을 교체 가능한 부품으로 두고 Agent Loop·도구 권한·세션 상태·검증·복구를 분리하는 것**이다. 이 관점은 역사 사료·유물·지도 데이터를 연결해 빈칸과 모순을 찾으려는 장기 프로젝트에도 적용된다.

## 읽을거리에서 얻은 판단

- model adapter, tool, session log, agent loop를 분리하면 모델 교체가 쉬워진다.
- 실행형 AI에서는 권한 정책과 실패 복구가 중요하다.
- 반복 호출이 많은 번역·추론 작업에서는 latency와 tokens/sec가 중요하다.
- Knowledge pipeline도 수집 → 요약 → 태그 → canonical 승격 → 검증 상태를 기록해야 한다.

## 역사 프로젝트에 적용할 구조

```text
사료·서적·유물·지도
  → 출처 보존 및 OCR
  → Person/Event/Place/Artifact/Time 추출
  → 관계·신뢰도·확정/추정 상태 기록
  → Contradiction/Missing Evidence 탐색
  → Hypothesis 생성
  → 사람이 원문 대조 후 승인
```

LLM은 후보 추출과 유사 기록 탐색에 사용하되 역사적 사실의 확정자는 아니다. 결과는 사실 목록뿐 아니라 연결 근거, 부족한 증거, 추가 조사 항목까지 포함해야 한다.

## 실행 우선순위

1. 사료 1종·유물 데이터 1종·지도 데이터 1종으로 작은 시대·지역 MVP 선정
2. Source와 Evidence를 먼저 고정하고 추론 결과는 Hypothesis로 분리
3. 날짜·지명·인물명 정규화와 원문 위치 기록
4. 모순과 미확인 연결을 별도 상태로 저장
5. 데이터 품질 검증 후 그래프·지도 시각화 추가

## 보류 TODO

- 대상 시대와 지역 좁히기
- 공개 데이터셋과 라이선스 확인
- OCR 오류가 인물명·지명 관계에 미치는 영향 측정
