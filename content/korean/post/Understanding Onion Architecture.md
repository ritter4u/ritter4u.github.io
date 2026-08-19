---
title: "Understanding Onion Architecture"
date: 2022-09-25
description: "Onion Architecture의 핵심 원칙, 레이어 구성, 장단점을 실무 관점에서 정리"
draft: false
toc: true
codeMaxLines: 10
codeLineNumbers: true
figurePositionShow: true
categories:
  - Architecture
tags:
  - Onion Architecture
  - DDD
  - Clean Architecture
---

원문 참고:
- https://www.codeguru.com/csharp/understanding-onion-architecture/
- https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/

## 한 줄 요약

Onion Architecture는 도메인 코어를 중심에 두고, 바깥 레이어가 안쪽을 의존하도록 만들어 결합도를 낮추는 아키텍처입니다.

## 왜 필요한가

전통적인 계층형 구조(Controller -> Service -> Repository)가 프로젝트 규모가 커질수록 다음 문제를 만들기 쉽습니다.

- 비즈니스 규칙이 프레임워크/인프라 코드에 섞임
- 테스트 작성 시 DB, 외부 API 의존이 강해짐
- 레이어 경계를 넘는 변경 전파가 잦아짐

Onion Architecture는 핵심 비즈니스 규칙을 중심으로 고립시켜 이 문제를 완화합니다.

## 핵심 원칙

1. 의존성 방향은 항상 바깥에서 안쪽으로 향한다.
2. 도메인 코어는 인프라 구현을 모른다.
3. 외부 기술(DB, 메시지 브로커, 웹 프레임워크)은 교체 가능한 어댑터로 다룬다.

## 레이어 구성

### 1) Domain Layer (Core)

- 엔티티, 값 객체, 도메인 규칙
- 외부 라이브러리 의존 최소화

### 2) Application Layer

- 유스케이스/서비스 오케스트레이션
- 트랜잭션 경계, 권한 체크 같은 애플리케이션 정책

### 3) Infrastructure Layer

- DB 접근 구현체, 메시징, 외부 API 클라이언트
- Domain/Application에서 정의한 포트를 구현

### 4) Presentation/UI Layer

- API Controller, CLI, UI
- 요청/응답 매핑과 입력 검증 책임

## 예시 의존성 구조

```text
[UI/API] -> [Application] -> [Domain]
   |             |
   +-------> [Infrastructure Adapter]
```

실제 컴파일 의존성은 `UI/Application -> Domain` 방향으로 유지하고, Infrastructure는 Domain에서 정의한 인터페이스를 구현하는 방식으로 연결합니다.

## 장점

- 도메인 중심 설계가 쉬움
- 단위 테스트 속도/안정성 향상
- 인프라 교체(DB, 메시징, 프레임워크) 비용 감소

## 단점

- 초기 설계 난이도와 러닝 커브 존재
- 작은 프로젝트에는 과설계가 될 수 있음
- 인터페이스/매핑 코드가 늘어남

## 적용 시 체크리스트

1. 도메인 모델이 인프라 패키지를 import하지 않는가
2. Repository 인터페이스는 도메인/애플리케이션에 있고 구현체는 인프라에 있는가
3. 유스케이스 테스트가 DB 없이 가능한가
4. 컨트롤러가 도메인 규칙을 직접 구현하지 않는가

## 정리

Onion Architecture는 "테스트 가능한 도메인 코어"를 만들기 위한 구조적 선택입니다. 모든 프로젝트의 정답은 아니지만, 도메인 복잡도가 높고 유지보수 기간이 긴 서비스에서는 효과가 큽니다.
