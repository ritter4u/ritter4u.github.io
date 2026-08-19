---
title: "Tomcat 10.1 Jakarta 마이그레이션 이슈"
date: 2026-03-04
description: "Tomcat 9 -> 10.1 전환 시 javax에서 jakarta로 옮길 때 발생하는 대표 장애 정리"
draft: false
toc: true
codeMaxLines: 15
codeLineNumbers: true
figurePositionShow: true
categories:
  - Java
  - Migration
tags:
  - Tomcat 10.1
  - Jakarta EE
  - Spring Boot 3
  - javax
---

## 한 줄 요약

Tomcat 10.1 전환은 톰캣 교체 작업이 아니라 `javax.* -> jakarta.*` 계약 변경 작업입니다. 코드, 의존성, 설정을 동시에 정리해야 안정적으로 올라갑니다.

## 왜 장애가 연쇄적으로 생기나

Tomcat 10.1은 Servlet 6.0(Jakarta EE 10) 기반입니다. Tomcat 9 시절 아티팩트를 그대로 배포하면 다음 오류가 바로 발생합니다.

- `ClassNotFoundException: javax.servlet.Filter`
- `NoClassDefFoundError: javax/servlet/http/HttpServletRequest`

## 이슈 1: `javax.servlet.*` 잔존

### 원인

소스 import 또는 3rd-party 라이브러리가 `javax`를 참조.

### 조치

1. import 전환
2. API 의존성 전환
3. 런타임 컨테이너 버전 정합성 점검

```java
// Before
import javax.servlet.Filter;

// After
import jakarta.servlet.Filter;
```

## 이슈 2: 배포는 되는데 필터/리스너 동작 이상

`web.xml`, `@WebFilter`, `@WebListener`가 구 스펙 기준이면 초기화/매핑이 어긋날 수 있습니다.

### 조치

- 가능하면 Java config 또는 Spring Boot 자동설정으로 정리
- `web.xml`을 유지한다면 Jakarta 스키마/버전으로 갱신

## 이슈 3: transitive dependency 충돌

내 코드를 `jakarta`로 바꿔도 의존성 트리 어딘가에서 `javax.servlet-api`가 유입되면 런타임 오류가 납니다.

```bash
mvn dependency:tree | grep -E "javax.servlet|jakarta.servlet"
```

`javax.servlet-api`가 보이면 유입 경로를 찾아 exclusion 또는 라이브러리 업그레이드를 적용합니다.

## 이슈 4: Spring Boot 2.x -> 3.x 동시 업그레이드 혼선

Tomcat 10.1 전환과 Boot 3 전환을 같이 하면 프레임워크 변경까지 겹쳐 원인 분리가 어려워집니다.

- Security 설정 방식 변경
- Validation 패키지 변경(`javax.validation` -> `jakarta.validation`)
- 기타 starter 의존성 정렬 이슈

### 권장 순서

1. 컴파일 오류(`javax` 관련) 먼저 제거
2. 통합 테스트로 런타임 오류를 계층별(Web/Security/Persistence) 분리
3. 마지막에 reverse proxy, 세션, 업로드 등 운영 경로 점검

## 실무 사례

### 사례 1: 로컬 내장 톰캣은 정상, 외부 톰캣 WAR만 실패

- 원인: WAR에 `javax.servlet-api` 유입
- 해결: dependency scope/exclusion 정리 후 `jakarta`로 통일

### 사례 2: 로그인 경로만 500

- 원인: 인증 필터 일부가 `javax` 잔존
- 해결: 보안 필터 체인 import/의존성 일괄 전환

## 체크리스트

1. 코드에서 `javax.` 문자열 전수 검색
2. `pom.xml` 또는 `build.gradle`의 `javax` 의존성 제거
3. 의존성 트리에서 `javax.servlet-api` 유입 경로 제거
4. 인증, 파일업로드, 예외처리, 세션 흐름 통합 테스트

## 정리

Tomcat 10.1 마이그레이션 성공 여부는 톰캣 버전보다 네임스페이스 일관성에 달려 있습니다. `javax` 흔적을 코드와 의존성에서 모두 없애는 것이 핵심입니다.
