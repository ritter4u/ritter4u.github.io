---
title: "folder2epub으로 이미지 폴더를 검색 가능한 EPUB으로 만들기"
date: 2026-08-16T00:00:00+09:00
draft: false
tags: ["Python", "EPUB", "OCR", "MLX", "Calibre"]
categories: ["개발"]
---

# folder2epub으로 이미지 폴더를 검색 가능한 EPUB으로 만들기

이미지로만 구성된 책은 읽을 수는 있어도 검색·복사·TTS가 어렵다. `folder2epub`은 이미지 폴더를 EPUB으로 만들고, 선택하면 페이지별 OCR 텍스트를 EPUB 내부에 함께 넣는다.

## 핵심 동작

- 이미지 파일을 자연 정렬한다. `1.jpg, 2.jpg, 10.jpg` 순서가 유지된다.
- 단일 책과 `--recursive` batch를 지원한다.
- `image`, `text`, `hybrid` 모드를 제공한다.
- hybrid 모드는 원본 페이지 이미지를 보존하면서 검색 가능한 OCR 텍스트를 추가한다.
- `--output`은 단일 파일, `--output-dir`은 batch 출력에 사용한다.

```bash
folder2epub ~/Books/my-book --ocr
folder2epub ~/Books --recursive --ocr --output-dir ~/Books/epub
```

## MLX와 PaddleOCR

Apple Silicon macOS에서는 MLX backend를 사용할 수 있다. MLX는 unified memory와 Metal GPU를 사용해 로컬에서 OCR을 실행한다. Windows·Linux·Intel Mac에서는 PaddleOCR을 선택한다. manga-ocr와 Tesseract도 별도 backend로 지원한다.

MLX weight와 PaddleOCR weight는 runtime과 형식이 다르므로 서로 바꿔 사용할 수 없다. `auto` 선택은 플랫폼에 맞는 실제 backend로 해석되어야 한다.

## 중단해도 다시 이어지는 cache

OCR은 책 폴더의 cache에 이미지 metadata, engine, 언어, engine 옵션을 포함한 key로 결과를 저장한다. 따라서 작업이 중단되어도 완료된 페이지는 재사용하고 남은 페이지만 처리할 수 있다. engine이나 옵션을 바꾸면 결과가 섞이지 않는다.

batch OCR 결과에서 페이지가 누락되거나 JSON 파싱에 실패하면 빈 텍스트를 성공으로 저장하지 않고 오류로 중단해야 한다. 이것이 대량 변환에서 가장 중요한 데이터 보존 규칙이다.

## Calibre와의 결합

Calibre Image EPUB OCR 플러그인은 OCR 결과를 EPUB3로 만들고, 원본을 유지한 채 `책 제목 - OCR` 새 책으로 등록한다. 작업은 백그라운드 큐에서 실행되므로 진행창을 닫아도 계속된다.

번역과 레이아웃 후편집은 별도 단계다. `calibre-epubhv-wrapper`는 가로쓰기·세로쓰기·CSS·후리가나를 보정하지만 번역하지 않는다.

## 운영 순서

1. 원본 이미지/EPUB을 보존한다.
2. OCR backend와 언어를 고정한다.
3. cache를 사용해 중단된 작업을 이어간다.
4. OCR 결과를 검수하고 번역한다.
5. 번역 후 방향·CSS·목차를 후편집한다.
6. 결과 EPUB을 새 파일/새 Calibre 레코드로 등록한다.

원본 보존, backend 분리, cache 재사용, OCR/번역/후편집 분리가 품질과 재현성을 함께 지키는 핵심이다.
