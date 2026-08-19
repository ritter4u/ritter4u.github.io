# tine.im 도메인 운영

## 현재 구조

- `tine.im`을 GitHub Pages 저장소의 공식 custom domain으로 사용한다.
- `ritter4u.github.io`는 기존 주소이자 레거시 진입점으로 보존한다.
- 정적 사이트 한 벌이 호스트명을 읽어 Valen/Kris 화면 문구와 색을 전환한다. 콘텐츠와 글 URL은 공유한다.

## DNS / GitHub Pages

1. `tine.im`은 GitHub Pages가 안내하는 apex 도메인 A 레코드를 사용한다. `valen.tine.im`과 `kris.tine.im`은 Cloudflare에서 관리한다.
2. 저장소의 **Settings → Pages**에서 Source를 GitHub Actions로 두고 Custom domain을 `tine.im`으로 저장한다.
3. HTTPS 적용이 완료된 뒤에만 강제 HTTPS를 켠다.

## `kris.tine.im` 처리

GitHub Pages 저장소에는 custom domain을 하나만 지정할 수 있으므로 `valen.tine.im`과 `kris.tine.im`을 Pages의 두 번째 custom domain으로 등록하지 않는다. Cloudflare를 DNS/프록시로 사용한다면 두 호스트를 Proxied 상태로 두고, Worker에서 모든 요청을 `https://tine.im`으로 가져오되 브라우저의 원래 URL은 유지한다.

개념적인 Worker 동작은 다음과 같다.

```js
export default {
  async fetch(request) {
    const url = new URL(request.url)
    if (url.hostname === "valen.tine.im" || url.hostname === "kris.tine.im") {
      const origin = new URL(request.url)
      origin.hostname = "tine.im"
      return fetch(new Request(origin, request))
    }
    return fetch(request)
  }
}
```

배포 후 `https://kris.tine.im/`에서 주소가 유지되고 Kris 화면이 보이는지, `https://valen.tine.im/`에서 Valen 화면이 보이는지 각각 확인한다. 기존 글과 `ritter4u.github.io`의 레거시 동작도 별도로 확인한다.
