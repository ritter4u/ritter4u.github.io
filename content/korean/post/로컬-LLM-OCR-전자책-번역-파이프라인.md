---
layout: post
title: "로컬 LLM·OCR·전자책 번역 파이프라인"
description: "Ollama·MLX·Qwen과 OCR·Calibre·folder2epub을 연결하는 로컬 우선 처리 원칙"
categories: [개발, AI]
tags: [ollama, mlx, qwen, ocr, paddleocr, calibre, folder2epub, translation]
publishdate: 2026-08-16
draft: false
---

# 결론

전자책 처리는 **원본 보존 → OCR/텍스트 추출 → 번역 → 후편집 → EPUB 검증**의 파생물 pipeline으로 관리한다. Ollama·MLX·Qwen은 모델 실행 계층이고 Calibre/folder2epub은 문서 변환 계층이므로 서로 직접 결합하지 않는다.

## 역할 분리

| 계층 | 역할 |
|---|---|
| 원본 | 이미지·PDF·EPUB 보존, 덮어쓰기 금지 |
| OCR | PaddleOCR 기본, manga-ocr 선택, Tesseract 호환 |
| 로컬 LLM | Ollama 또는 MLX에서 Qwen 계열 등 실행 |
| 번역 | 문단·장 단위 번역과 용어 일관성 유지 |
| 후편집 | Calibre 또는 XHTML/CSS 조정 |
| 검증 | 텍스트·렌더링·개인정보·페이지 수 확인 |

## 권장 흐름

```text
원본 책
  → 작업 복사본/manifest
  → OCR 또는 기존 text 추출
  → 번역 초안
  → 용어·문장·HTML 후편집
  → EPUB 생성
  → 목차·검색·페이지 순서 검증
  → 실패 페이지 기록
```

## OCR과 cache

OCR backend는 factory로 만들고 한 책 처리 동안 재사용한다. 기본은 PaddleOCR 일본어이며 manga-ocr과 Tesseract는 명시적으로 선택한다. 이미지 경로·크기·수정 시각·engine·language·옵션을 cache key에 포함해 결과 충돌을 막는다.

## 번역 후편집 원칙

- 번역 전 문단 경계와 페이지 순서를 고정한다.
- 고유명사·기술 용어 glossary를 먼저 만든다.
- 모델 변경 시 누락·순서 변경·HTML 파손을 검사한다.
- XHTML 구조, CSS, 목차, metadata까지 확인한다.
- 입력 manifest, 모델명, 옵션, 생성 시각을 기록한다.

## 성공 기준

- 원본이 변경되지 않았다.
- 모든 페이지와 누락 페이지가 기록되었다.
- EPUB이 열리고 목차·검색·페이지 순서가 정상이다.
- OCR·번역 실패를 숨기지 않고 재처리할 수 있다.
- 민감한 원문이 외부 서비스로 전송되지 않았다.

## 후속 TODO

- folder2epub의 PaddleOCR 기본 backend와 cache key 검증
- Qwen/Ollama와 MLX의 tokens/sec·메모리·누락률 비교
- Calibre 후편집 체크리스트를 이미지책과 텍스트 EPUB으로 분리
