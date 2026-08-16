---
title: "PostGIS와 Spring API로 Polygon 데이터를 다루는 GIS POC"
date: 2026-08-16T00:00:00+09:00
draft: false
tags: ["PostGIS", "Spring Boot", "Kotlin", "GIS", "Spatial Database"]
categories: ["개발"]
---

# PostGIS와 Spring API로 Polygon 데이터를 다루는 GIS POC

GIS POC의 핵심은 지도 화면보다 공간 데이터를 저장하고 API로 안전하게 전달하는 경계다. 원본 POC는 PostGIS 컨테이너, Kotlin/Spring Boot API, Polygon 도메인 모델을 각각 나누어 실험한다.

## 구성

- PostGIS: 공간 데이터 저장과 geometry 연산
- Spring Data/JPA: Polygon entity와 repository
- Kotlin/Spring REST API: 페이지 단위 조회
- Swagger: API 확인
- 지도 클라이언트: 좌표계와 geometry 렌더링 검증

대상 데이터는 토지대장 Polygon이며 geometry 컬럼은 MultiPolygon, EPSG:5179로 관리한다.

## API 모델

Entity에는 gid, pnu, jibun 같은 속성과 JTS Geometry가 있고, 응답에는 DTO 경계를 둔다. GET /Polygon/GetAll은 Spring Data Pageable과 PagedResourcesAssembler를 사용해 대량 Polygon을 한 번에 반환하지 않는다.

PostGIS
  → PolygonEntity
  → PolygonDTO
  → 페이지 응답
  → 지도 클라이언트

Geometry를 JSON으로 내보낼 때는 Entity를 그대로 노출하기보다 serializer와 별도 응답 모델을 두는 편이 안전하다. 지도 클라이언트가 GeoJSON을 요구하면 API 경계에서 명시적으로 변환해야 한다.

## 운영 순서

1. PostGIS 컨테이너와 extension을 준비한다.
2. 테이블과 SRID를 확인한다.
3. datasource 설정을 환경변수로 주입한다.
4. Spring API를 실행한다.
5. Swagger와 GET /Polygon/GetAll에서 페이지 응답을 확인한다.
6. 실제 지도 클라이언트에서 EPSG:5179 변환과 렌더링을 확인한다.

## 주의점

원본 POC에는 개발용 설정과 raw GIS 데이터가 함께 있다. 운영·공개 저장소에는 DB 비밀번호, dump, shapefile을 넣지 않는다. 공간 데이터와 API 코드는 분리하고, 인증정보는 환경변수나 비밀 저장소로 관리한다.

## 결론

PostGIS 기반 GIS API에서는 다음 세 가지가 가장 중요하다.

- DB·API·클라이언트가 동일한 SRID 계약을 지킨다.
- Entity와 DTO를 분리하고 geometry 직렬화를 명시한다.
- 페이지네이션과 원본 데이터 보존을 기본값으로 둔다.

이 경계를 지키면 저장소를 바꾸거나 지도 클라이언트를 교체해도 API 계약을 안정적으로 유지할 수 있다.
