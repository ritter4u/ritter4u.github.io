---
title: "Spring Boot 3 + Keycloak realm role 설정"
date: 2026-03-04
description: "Spring Security 6에서 Keycloak realm role을 안정적으로 권한 매핑하는 방법"
draft: false
toc: true
codeMaxLines: 15
codeLineNumbers: true
figurePositionShow: true
categories:
  - Security
  - Spring
tags:
  - Spring Boot 3
  - Keycloak
  - Spring Security 6
  - JWT
---

## 한 줄 요약

Spring Boot 3에서는 Keycloak의 `realm_access.roles`를 기본값만으로는 권한으로 쓰기 어렵습니다. `JwtAuthenticationConverter`에 커스텀 converter를 연결해 `ROLE_*`로 명시 매핑해야 합니다.

## 왜 자주 403이 나는가

다음 두 조건이 동시에 만족되어야 `hasRole("admin")`가 동작합니다.

1. Access token에 `realm_access.roles`가 실제로 존재
2. Spring Security의 `GrantedAuthority`로 `ROLE_admin`이 생성

Keycloak에서 role을 발급해도 2번이 빠지면 인증은 성공(200/401)해도 인가에서 403이 발생합니다.

## 토큰에서 먼저 볼 필드

```json
{
  "iss": "http://localhost:8080/realms/my-realm",
  "realm_access": {
    "roles": ["admin", "user"]
  },
  "resource_access": {
    "my-api": {
      "roles": ["api.read"]
    }
  },
  "scope": "profile email"
}
```

- `iss`: `issuer-uri`와 정확히 일치해야 함
- `realm_access.roles`: realm role 매핑 대상
- `resource_access.{client}.roles`: client role이 필요할 때만 별도 매핑

## 권장 구현

핵심은 `SCOPE_*` 권한은 유지하고, realm role을 추가로 합치는 방식입니다.

```java
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/admin/**").hasRole("admin")
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())));
        return http.build();
    }

    @Bean
    Converter<Jwt, ? extends AbstractAuthenticationToken> jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new KeycloakJwtAuthoritiesConverter());
        return converter;
    }
}
```

```java
public class KeycloakJwtAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    private final JwtGrantedAuthoritiesConverter defaultScopes = new JwtGrantedAuthoritiesConverter();

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Set<GrantedAuthority> authorities = new HashSet<>(defaultScopes.convert(jwt));

        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        if (realmAccess == null) {
            return authorities;
        }

        Object rolesObj = realmAccess.get("roles");
        if (!(rolesObj instanceof Collection<?> roles)) {
            return authorities;
        }

        roles.stream()
            .filter(String.class::isInstance)
            .map(String.class::cast)
            .map(role -> "ROLE_" + role)
            .map(SimpleGrantedAuthority::new)
            .forEach(authorities::add);

        return authorities;
    }
}
```

## application.yml

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8080/realms/my-realm
```

## 실제 문제 사례

### 사례 1: `hasRole("admin")`만 403

- 원인: 커스텀 converter 미적용
- 해결: `realm_access.roles -> ROLE_*` 매핑 추가

### 사례 2: 운영에서만 401

- 원인: 토큰 `iss`와 서비스 `issuer-uri` 불일치
- 해결: 운영 토큰 기준으로 `issuer-uri` 교정

### 사례 3: `scope` 기반 API가 갑자기 막힘

- 원인: 커스텀 converter가 default scope 권한을 덮어씀
- 해결: 기본 `JwtGrantedAuthoritiesConverter` 결과를 merge

## 점검 체크리스트

1. 토큰에 `realm_access.roles`가 있는가
2. `ROLE_` prefix로 authority가 생성되는가
3. `@EnableMethodSecurity`가 활성화되어 있는가
4. `issuer-uri`와 `iss`가 일치하는가
5. 기존 `SCOPE_*` 권한이 유지되는가

## 정리

Spring Boot 3 + Keycloak 권한 이슈는 대부분 "토큰 미발급"보다 "권한 매핑 누락"에서 발생합니다. 인증(401)과 인가(403)를 분리해 확인하면 장애 대응 속도가 빨라집니다.
