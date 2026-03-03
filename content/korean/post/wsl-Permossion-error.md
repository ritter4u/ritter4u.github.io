---
author: Keunreol Park
title: "WSL Permission Error 해결"
date: 2022-09-16
description: "Windows + WSL 환경에서 파일 권한 문제가 발생할 때 빠르게 복구하는 방법"
draft: false
toc: true
codeMaxLines: 10
codeLineNumbers: true
figurePositionShow: true
categories:
  - Dev Environment
tags:
  - WSL
  - Linux
  - Permission
  - Windows
---

## 증상

WSL에서 `/mnt/c` 아래 파일 작업 시 다음과 같은 권한 오류가 발생합니다.

- `Permission denied`
- 실행 권한(`chmod +x`)이 유지되지 않음
- Git이 파일 mode 변경을 과도하게 감지

## 원인

기본 마운트 옵션에서는 Linux 메타데이터 권한이 충분히 반영되지 않을 수 있습니다.

## 해결 방법

`/etc/wsl.conf`에 automount 옵션을 설정합니다.

```conf
[automount]
options = "metadata"
```

설정 후 WSL을 완전히 재시작해야 적용됩니다.

```powershell
wsl --shutdown
```

그 다음 WSL을 다시 열어 동작을 확인합니다.

## 추가 점검

1. 프로젝트가 `/mnt/c/...`에 있으면 I/O 성능과 권한 이슈가 더 자주 발생할 수 있음
2. 장기적으로는 WSL Linux 파일시스템(`~/project`)에서 개발하는 것이 안정적
3. Git mode 변경이 계속 잡히면 `core.filemode` 설정을 점검

## 정리

WSL 권한 문제의 빠른 1차 해법은 `metadata` 옵션 적용입니다. 이후에도 이슈가 남으면 프로젝트 위치와 Git 설정까지 함께 점검하는 것이 좋습니다.
