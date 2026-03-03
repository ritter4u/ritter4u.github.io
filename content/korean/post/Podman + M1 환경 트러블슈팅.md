---
author: Keunreol Park
title: "Podman + M1 환경 트러블슈팅"
date: 2026-03-04
description: "Apple Silicon(M1)에서 Podman 사용 시 자주 만나는 이슈와 해결 절차"
draft: false
toc: true
codeMaxLines: 15
codeLineNumbers: true
figurePositionShow: true
categories:
  - DevOps
  - Container
tags:
  - Podman
  - Apple Silicon
  - M1
  - Troubleshooting
---

## 한 줄 요약

M1에서 Podman 문제는 컨테이너 명령보다 `podman machine` 상태와 아키텍처(`arm64`/`amd64`)를 먼저 확인해야 빠르게 풀립니다.

## 진단 시작점

```bash
podman machine list
podman info
podman ps -a
```

- `podman info` 실패: 앱 디버깅 전에 machine부터 복구
- `podman ps -a`의 `Exited`, `Restarting` 확인

## 이슈 1: Podman socket 연결 실패

### 증상

- `Error: unable to connect to Podman socket`
- CLI가 응답 없이 멈춘 것처럼 보임

### 조치

```bash
podman machine stop
podman machine start
podman system connection list
podman info
```

지속 재발 시 machine 재생성이 가장 확실합니다.

```bash
podman machine rm -f
podman machine init
podman machine start
```

## 이슈 2: `amd64` 이미지에서 느림/비정상 종료

### 원인

Apple Silicon에서 `linux/amd64`는 에뮬레이션 경로를 타기 때문에 성능 저하와 런타임 변동이 큽니다.

### 조치

1. 멀티 아키텍처 이미지를 우선 사용
2. 가능한 경우 `linux/arm64` 명시

```bash
podman run --platform linux/arm64 -it --rm nginx:latest
```

## 이슈 3: compose 일부 서비스만 재시작 루프

### 흔한 원인

- healthcheck 실패
- 볼륨 마운트 권한 불일치
- x86 전용 바이너리 의존

### 확인 순서

```bash
podman compose ps
podman compose logs --tail=200 <service-name>
podman inspect <container-name> --format '{{.State.Status}} {{.State.ExitCode}} {{.State.Error}}'
```

`ExitCode`와 최초 예외 스택을 보면 원인을 빠르게 좁힐 수 있습니다.

## 이슈 4: 포트는 publish됐는데 접속 실패

macOS에서는 VM 포워딩을 거치므로 포트 충돌과 앱 바인딩 주소를 같이 봐야 합니다.

```bash
lsof -iTCP:8080 -sTCP:LISTEN
podman port <container>
```

컨테이너 내부 앱이 `127.0.0.1`에만 바인딩되면 외부 접근이 안 됩니다. 서버 바인딩은 `0.0.0.0`로 설정합니다.

## 실전 운영 팁

1. `podman machine set --cpus --memory --disk-size`로 리소스 선조정
2. base image를 `arm64` 우선으로 선택
3. `logs`보다 `inspect`의 상태/종료코드를 먼저 확인
4. 로컬과 CI에 동일한 실행 스크립트를 사용

## 정리

M1 + Podman은 "소켓", "플랫폼", "헬스체크" 3축으로 보면 대부분 원인을 빠르게 찾을 수 있습니다.
