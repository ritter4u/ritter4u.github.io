---
title: "JWT" # Title of the blog post.
date: 2022-11-17T02:37:02+09:00 # Date of post creation.
description: "Introduction to JSON Web Tokens" # Description used for search engine.
featured: false # Sets if post is a featured post, making appear on the home page side bar.
draft: false # Sets whether to render this page. Draft of true will not be rendered.
toc: true # Controls if a table of contents should be generated for first-level links automatically.
# menu: main
# featureImage: "/images/path/file.jpg" # Sets featured image on blog post.
# thumbnail: "/images/path/thumbnail.png" # Sets thumbnail image appearing inside card on homepage.
# shareImage: "/images/path/share.png" # Designate a separate image for social media sharing.
codeMaxLines: 10 # Override global value for how many lines within a code block before auto-collapsing.
codeLineNumbers: true # Override global value for showing of line numbers within code block.
figurePositionShow: true # Override global value for showing the figure label.
categories:
  - Technology
tags:
  - JWT
  - "JSON Web Tokens"
# serises:
#  - Serises
# comment: false # Disable comment if false.
---
출처 : https://jwt.io/introduction
**신규:** [JWT 핸드북을 무료로](https://auth0.com/resources/ebooks/jwt-handbook?_ga=2.117482956.490692208.1668690053-459585628.1668690053&_gl=1*11xcbtg*rollup_ga*NDU5NTg1NjI4LjE2Njg2OTAwNTM.*rollup_ga_F1G3E656YZ*MTY2ODY5MDA1Mi4xLjEuMTY2ODY5MDA2NS40Ny4wLjA.) 받고 JWT 에 대해 자세히 알아보세요!

JWT(JSON Web Token)는 당사자 간에 정보를 JSON 개체로 안전하게 전송하기 위한 간결하고 독립적인 방법을 정의하는 개방형 표준( [RFC 7519](https://tools.ietf.org/html/rfc7519) )입니다. 이 정보는 디지털 서명되어 있으므로 확인하고 신뢰할 수 있습니다. **JWT는 비밀( HMAC** 알고리즘 포함) 또는 **RSA** 또는 **ECDSA** 를 사용하는 공개/개인 키 쌍을 사용 하여 서명할 수 있습니다 .

JWT를 암호화하여 당사자 간에 비밀성을 제공할 수도 있지만 여기서는 _서명_ 된 토큰에 중점을 둘 것입니다. _서명된 토큰은 그 안에 포함된 클레임의 무결성_ 을 확인할 수 있는 반면 암호화된 토큰 은 다른 당사자로부터 해당 클레임을 _숨깁니다 ._ 공개/개인 키 쌍을 사용하여 토큰에 서명할 때 서명은 개인 키를 보유한 당사자만이 서명한 당사자임을 인증합니다.

## 언제 JSON 웹 토큰을 사용해야 합니까?

다음은 JSON 웹 토큰이 유용한 몇 가지 시나리오입니다.

-   **권한 부여** : JWT를 사용하는 가장 일반적인 시나리오입니다. 사용자가 로그인하면 이후의 각 요청에는 JWT가 포함되어 사용자가 해당 토큰으로 허용된 경로, 서비스 및 리소스에 액세스할 수 있습니다. Single Sign On은 오버헤드가 적고 다양한 도메인에서 쉽게 사용할 수 있기 때문에 현재 JWT를 널리 사용하는 기능입니다.

-   **정보 교환** : JSON 웹 토큰은 당사자 간에 정보를 안전하게 전송하는 좋은 방법입니다. 예를 들어 공개/개인 키 쌍을 사용하여 JWT에 서명할 수 있으므로 보낸 사람이 누구인지 확인할 수 있습니다. 또한 헤더와 페이로드를 사용하여 서명을 계산하므로 콘텐츠가 변조되지 않았음을 확인할 수도 있습니다.


## JSON 웹 토큰 구조는 무엇입니까?

간단한 형태의 JSON 웹 토큰은 점( `.`)으로 구분된 세 부분으로 구성됩니다.

-   헤더
-   유효 탑재량
-   서명

따라서 JWT는 일반적으로 다음과 같습니다.

`xxxxx.yyyyy.zzzzz`

다른 부분을 분해합시다.

### 헤더

헤더 _는 일반적으로_ 토큰 유형(JWT)과 사용 중인 서명 알고리즘(예: HMAC SHA256 또는 RSA)의 두 부분으로 구성됩니다.

예를 들어:

```
{
  "alg": "HS256",
  "typ": "JWT"
}
```

그런 다음 이 JSON은 **Base64Url** 로 인코딩되어 JWT의 첫 번째 부분을 구성합니다.

### 유효 탑재량

토큰의 두 번째 부분은 클레임을 포함하는 페이로드입니다. 클레임은 엔터티(일반적으로 사용자) 및 추가 데이터에 대한 설명입니다. _클레임에는 등록된_ 클레임 , _공개_ 클레임 및 _비공개_ 클레임 의 세 가지 유형이 있습니다 .

-   [**등록된 클레임**](https://tools.ietf.org/html/rfc7519#section-4.1) : 필수는 아니지만 유용하고 상호 운용 가능한 클레임을 제공하기 위해 권장되는 미리 정의된 클레임 집합입니다. 그들 중 일부는 **iss** (발급자), **exp** (만료 시간), **sub** (주제), **aud** (대상) 및 [기타](https://tools.ietf.org/html/rfc7519#section-4.1) 입니다.

    > JWT가 컴팩트하기 때문에 클레임 이름은 3자에 불과합니다.

-   [**공개 클레임**](https://tools.ietf.org/html/rfc7519#section-4.2) : JWT를 사용하는 사람들이 마음대로 정의할 수 있습니다. 그러나 충돌을 방지하려면 [IANA JSON 웹 토큰 레지스트리](https://www.iana.org/assignments/jwt/jwt.xhtml) 에 정의하거나 충돌 방지 네임스페이스를 포함하는 URI로 정의해야 합니다.

-   [**개인 클레임**](https://tools.ietf.org/html/rfc7519#section-4.3) : 사용에 동의한 당사자 간에 정보를 공유하기 위해 생성된 사용자 정의 클레임이며 _등록_ 또는 _공개_ 클레임이 아닙니다.


페이로드의 예는 다음과 같습니다.

```
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

그런 다음 페이로드는 **Base64Url** 로 인코딩되어 JSON 웹 토큰의 두 번째 부분을 형성합니다.

> 서명된 토큰의 경우 이 정보는 변조로부터 보호되지만 누구나 읽을 수 있습니다. 암호화되지 않은 경우 JWT의 페이로드 또는 헤더 요소에 비밀 정보를 입력하지 마십시오.

### 서명

서명 부분을 생성하려면 인코딩된 헤더, 인코딩된 페이로드, 비밀, 헤더에 지정된 알고리즘을 가져와서 서명해야 합니다.

예를 들어 HMAC SHA256 알고리즘을 사용하려는 경우 서명은 다음과 같은 방식으로 생성됩니다.

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

서명은 도중에 메시지가 변경되지 않았는지 확인하는 데 사용되며 개인 키로 서명된 토큰의 경우 JWT 발신자가 누구인지 확인할 수도 있습니다.

### 모두 합치기

출력은 HTML 및 HTTP 환경에서 쉽게 전달할 수 있는 점으로 구분된 3개의 Base64-URL 문자열이며 SAML과 같은 XML 기반 표준과 비교할 때 더 작습니다.

다음은 이전 헤더와 페이로드가 인코딩되고 암호로 서명된 JWT를 보여줍니다. ![인코딩된 JWT](https://cdn.auth0.com/content/jwt/encoded-jwt3.png)

JWT를 사용하고 이러한 개념을 실행하려는 경우 [jwt.io 디버거](https://jwt.io/#debugger-io) 를 사용하여 JWT 를 디코딩, 확인 및 생성할 수 있습니다.

![JWT.io 디버거](https://cdn.auth0.com/blog/legacy-app-auth/legacy-app-auth-5.png)

## JSON 웹 토큰은 어떻게 작동합니까?

인증에서 사용자가 자격 증명을 사용하여 성공적으로 로그인하면 JSON 웹 토큰이 반환됩니다. 토큰은 자격 증명이므로 보안 문제를 방지하기 위해 세심한 주의를 기울여야 합니다. 일반적으로 필요 이상으로 토큰을 보관해서는 안 됩니다.

또한 [보안 부족으로 인해 민감한 세션 데이터를 브라우저 저장소에 저장해서는 안](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage) 됩니다.

사용자가 보호된 경로 또는 리소스에 액세스하려고 할 때마다 사용자 에이전트는 일반적으로 **Bearer** 스키마 를 사용하여 **Authorization** 헤더 에서 JWT를 보내야 합니다. 헤더의 내용은 다음과 같아야 합니다.

```
Authorization: Bearer <token>
```

이는 경우에 따라 상태 비저장 권한 부여 메커니즘일 수 있습니다. `Authorization`서버의 보호된 경로는 헤더 에서 유효한 JWT를 확인하고 JWT가 있는 경우 사용자는 보호된 리소스에 액세스할 수 있습니다. JWT에 필요한 데이터가 포함되어 있으면 항상 그런 것은 아니지만 특정 작업에 대해 데이터베이스를 쿼리해야 할 필요성이 줄어들 수 있습니다.

HTTP 헤더를 통해 JWT 토큰을 보내는 경우 토큰이 너무 커지지 않도록 해야 합니다. 일부 서버는 8KB 이상의 헤더를 허용하지 않습니다. [모든 사용자 권한을 포함하는 것과 같이 JWT 토큰에 너무 많은 정보를 포함하려는 경우 Auth0 Fine-Grained Authorization](https://fga.dev/) 과 같은 대체 솔루션이 필요할 수 있습니다 .

헤더 에 토큰이 전송되면 `Authorization`CORS(Cross-Origin Resource Sharing)는 쿠키를 사용하지 않으므로 문제가 되지 않습니다.

다음 다이어그램은 API 또는 리소스에 액세스하기 위해 JWT를 얻고 사용하는 방법을 보여줍니다.

![JSON 웹 토큰은 어떻게 작동합니까?](https://cdn2.auth0.com/docs/media/articles/api-auth/client-credentials-grant.png)

1.  애플리케이션 또는 클라이언트가 권한 부여 서버에 대한 권한 부여를 요청합니다. 이것은 다른 인증 흐름 중 하나를 통해 수행됩니다. 예를 들어 일반적인 [OpenID Connect](http://openid.net/connect/) 호환 웹 애플리케이션은 [인증 코드 흐름](http://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)`/oauth/authorize` 을 사용하여 엔드포인트를 통과합니다 .[](http://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)
2.  권한이 부여되면 권한 서버는 애플리케이션에 액세스 토큰을 반환합니다.
3.  애플리케이션은 액세스 토큰을 사용하여 보호된 리소스(예: API)에 액세스합니다.

서명된 토큰을 사용하면 토큰에 포함된 모든 정보가 사용자 또는 다른 당사자가 변경할 수 없더라도 노출된다는 점에 유의하십시오. 즉, 토큰에 비밀 정보를 입력하면 안 됩니다.

## JSON 웹 토큰을 사용해야 하는 이유는 무엇입니까?

**Simple Web Tokens(SWT)** 및 **Security Assertion Markup Language Tokens(SAML)** 과 비교할 때 **JWT(JSON Web Tokens)** 의 이점에 대해 이야기해 보겠습니다 .

JSON은 XML보다 덜 장황하므로 인코딩될 때 크기도 더 작아 JWT가 SAML보다 더 작습니다. 따라서 JWT는 HTML 및 HTTP 환경에서 전달하기에 좋은 선택입니다.

보안 측면에서 SWT는 HMAC 알고리즘을 사용하는 공유 비밀에 의해서만 대칭적으로 서명될 수 있습니다. 그러나 JWT 및 SAML 토큰은 서명을 위해 X.509 인증서 형식의 공개/개인 키 쌍을 사용할 수 있습니다. 모호한 보안 허점을 도입하지 않고 XML 디지털 서명으로 XML에 서명하는 것은 JSON 서명의 단순성과 비교할 때 매우 어렵습니다.

JSON 파서는 개체에 직접 매핑되기 때문에 대부분의 프로그래밍 언어에서 일반적입니다. 반대로 XML에는 자연스러운 문서-객체 매핑이 없습니다. 따라서 SAML 어설션보다 JWT로 작업하기가 더 쉽습니다.

사용법과 관련하여 JWT는 인터넷 규모에서 사용됩니다. 이는 여러 플랫폼, 특히 모바일에서 JSON 웹 토큰의 클라이언트 측 처리 용이성을 강조합니다.

![인코딩된 JWT와 인코딩된 SAML의 길이 비교](https://cdn.auth0.com/content/jwt/comparing-jwt-vs-saml2.png) _인코딩된 JWT와 인코딩된 SAML의 길이 비교_

JSON 웹 토큰에 대해 자세히 알아보고 이를 사용하여 자신의 애플리케이션에서 인증을 수행하려면 Auth0에서 [JSON 웹 토큰 랜딩 페이지 로 이동하십시오.](http://auth0.com/learn/json-web-tokens)
