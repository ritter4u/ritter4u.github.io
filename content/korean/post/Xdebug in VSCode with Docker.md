---
title: "Xdebug in VSCode with Docker"
date: 2022-09-30T14:31:09+09:00
description: "Docker 컨테이너 내부 PHP를 VSCode Xdebug로 디버깅하는 실전 설정"
draft: false
toc: true
codeMaxLines: 15
codeLineNumbers: true
figurePositionShow: false
categories:
  - Programming
tags:
  - PHP
  - Xdebug
  - VSCode
  - Docker
---

참고 원문:
- https://dev.to/jackmiras/xdebug-in-vscode-with-docker-379l

## 목표

컨테이너 안에서 실행되는 PHP를 VSCode에서 브레이크포인트 기반으로 디버깅합니다.

## 1) Xdebug 설정 (`xdebug.ini`)

```ini
zend_extension=xdebug.so
xdebug.mode=develop,debug
xdebug.start_with_request=yes
xdebug.client_port=9003
xdebug.client_host=<HOST_IP>
xdebug.log=/dev/stdout
xdebug.log_level=0
```

핵심 포인트:
- `xdebug.client_host`: IDE가 실행되는 호스트 IP
- `xdebug.client_port`: VSCode와 동일 포트 사용(기본 9003)
- `xdebug.start_with_request=yes`: 요청마다 디버깅 시작

호스트 IP 확인 예시:

```bash
# macOS
ipconfig getifaddr en0

# WSL
grep nameserver /etc/resolv.conf | cut -d ' ' -f2

# Linux
hostname -I | cut -d ' ' -f1
```

## 2) VSCode 확장 설치

- 확장: `PHP Debug` (Xdebug 지원)

## 3) `launch.json` 설정

`.vscode/launch.json`에 아래 구성을 추가합니다.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Listen for Xdebug (Docker)",
      "type": "php",
      "request": "launch",
      "port": 9003,
      "pathMappings": {
        "/var/www/html": "${workspaceFolder}"
      }
    }
  ]
}
```

`pathMappings`는 컨테이너 내부 코드 경로와 로컬 프로젝트 경로를 정확히 맞추는 것이 핵심입니다.

## 4) 동작 확인 절차

1. 컨테이너 재시작
2. VSCode에서 "Listen for Xdebug" 시작
3. 브라우저/테스트 요청 실행
4. 브레이크포인트 정지 확인

## 자주 막히는 포인트

1. `client_host`가 잘못됨
2. 컨테이너 내부 코드 경로와 `pathMappings` 불일치
3. 9003 포트 충돌 또는 방화벽 차단
4. FPM/웹서버에 Xdebug 설정이 로드되지 않음

## 정리

Docker + VSCode Xdebug는 `client_host`, `port`, `pathMappings` 3가지만 정확히 맞추면 대부분 안정적으로 동작합니다.
