---
author: Keunreol Park
title: "MyBatis mapUnderscoreToCamelCase 실제 문제 사례"
date: 2026-03-04
description: "mapUnderscoreToCamelCase 설정이 있어도 매핑이 실패하는 실제 패턴과 대응법"
draft: false
toc: true
codeMaxLines: 15
codeLineNumbers: true
figurePositionShow: true
categories:
  - Java
  - Database
tags:
  - MyBatis
  - mapUnderscoreToCamelCase
  - SQL
  - Troubleshooting
---

## 한 줄 요약

`mapUnderscoreToCamelCase=true`는 단순 컬럼 매핑 생산성을 높여주지만, 조인/중첩 객체/예외 네이밍까지 자동으로 해결하지는 않습니다.

## 기본 설정

```yaml
mybatis:
  configuration:
    map-underscore-to-camel-case: true
```

이 설정은 `user_name -> userName` 같은 전형적인 snake_case 변환에만 강합니다.

## 사례 1: alias 때문에 자동 매핑 실패

### SQL

```sql
SELECT
  user_name AS username,
  created_at AS createdAt
FROM users
```

### DTO

```java
public class UserDto {
    private String userName;
    private LocalDateTime createdAt;
}
```

- `createdAt`: 컬럼 alias와 프로퍼티명이 같아 매핑 가능
- `username`: `userName`과 다르므로 매핑 누락 가능

### 조치

1. alias를 DTO 프로퍼티명과 정확히 일치
2. 또는 `resultMap`으로 명시 매핑

## 사례 2: 중첩 객체 매핑 누락

```java
public class OrderDto {
    private Long orderId;
    private UserDto user;
}
```

`mapUnderscoreToCamelCase`만으로는 `user.userName` 같은 중첩 구조 매핑이 자동 처리되지 않습니다.

### 조치

```xml
<resultMap id="orderMap" type="OrderDto">
  <id property="orderId" column="order_id"/>
  <association property="user" javaType="UserDto">
    <result property="userName" column="user_name"/>
  </association>
</resultMap>
```

## 사례 3: `select *` + 조인 컬럼 충돌

`id`, `created_at` 같은 공통 컬럼명이 중복되면 어떤 컬럼이 어떤 프로퍼티로 들어갔는지 불명확해집니다.

### 조치

1. `select *` 지양
2. 컬럼을 명시적으로 선택
3. 충돌 컬럼은 DTO 기준 alias로 명확화

## 사례 4: 컬럼 네이밍 예외

예: `user__name`, `USER_NAME`, `user-name`

규칙에서 벗어난 컬럼명은 변환 규칙만으로 안정적으로 매핑되지 않습니다.

### 조치

- 스키마 네이밍 규칙 정규화
- 예외 컬럼은 `resultMap`으로 직접 매핑

## 실무 운영 패턴

1. 단순 단건/목록 조회: `resultType` + camel case 변환
2. 조인/중첩 객체: `resultMap`을 기본값으로 사용
3. SQL 로그에 실행 쿼리와 바인딩 파라미터를 함께 기록
4. 장애 시 자동 매핑을 의심하고 `resultMap`으로 빠르게 고정

## 정리

`mapUnderscoreToCamelCase`는 편의 기능입니다. 복잡 쿼리에서는 "자동 매핑 + 명시 매핑" 혼합 전략이 가장 안전합니다.
