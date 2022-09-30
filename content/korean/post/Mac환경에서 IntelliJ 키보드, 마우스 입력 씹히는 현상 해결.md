---
title: "Mac환경에서 IntelliJ 키보드, 마우스 입력 씹힘 문제 해결" # Title of the blog post.
date: 2022-09-26T14:31:09+09:00 # Date of post creation.
description: "Mac환경에서 IntelliJ 키보드, 마우스 입력 씹힘 문제 해결" # Description used for search engine.
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
  - Tip
tags:
  - IntelliJ
  - Jetbrains
  - Mac
# serises:
#   - Serises
# comment: false # Disable comment if false.
---
Created: September 27, 2022 11:57 PM
URL: https://velog.io/@d-h-k/Mac%ED%99%98%EA%B2%BD%EC%97%90%EC%84%9C-IntelliJ-%ED%82%A4%EB%B3%B4%EB%93%9C-%EB%A7%88%EC%9A%B0%EC%8A%A4-%EC%9E%85%EB%A0%A5-%EC%94%B9%ED%9E%98-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0

맥으로 넘어온 이후 인텔리제이가 가끔 키입력 혹은 마우스 입력히 씹히는 문제가 있었습니다. 꽤나 빈번하게 발생했던지라 해결책을 찾아 적용해봤더니 아름답게 작동하여 해결책을 공유합니다

원문 : [https://androphil.tistory.com/759?category=423961](https://androphil.tistory.com/759?category=423961)

## [Mac IntelliJ Tip] 키 입력 먹통 해결

### 현상

IntelliJ에서 코딩하다 보면 가끔 영문 키 입력이 길게 눌러져서 위에처럼 특수문자가 뜨는 경우가 있다.
 그런데.. 뜨는 건 좋은데.. 이렇게 뜨고 난 이후에는 키 를 한번 눌러서는 타이핑이 안된다ㅠ

### 원인

찾아보니 idea editor에서 맥의 기능중에 악센트 문자 입력 기능이 제대로 지원이 안되는 듯

### 해결1 - 입력소스 전환

- 한영키로 입력소스를 한글로 전환하였다가 다시 영문으로 변경 후 타이핑.
- 매번 이짓을...

### 해결2 - 맥 자체의 악센트 입력 기능 비활성화

  한번만 하면 영원히 곳통에 벗어날 수 있다..
  (terminal에서 해당 명령어 실행 후 Mac 재실행) 
  OS 전체 적용 
  ```
  defaults write -g ApplePressAndHoldEnabled -bool false 
  ```
  IntelliJ 만 적용
  ```
  defaults write com.jetbrains.intellij ApplePressAndHoldEnabled -bool false 
  ```
  IntelliJ(community edition) 만 적용 
  ```
  defaults write com.jetbrains.intellij.ce ApplePressAndHoldEnabled -bool false
  ```
 왜 진작 안찾아보고 IntelliJ를 껐다 켰다 했을까.. 삽질하지 맙시다.ㅋㅋ

출처: [https://androphil.tistory.com/759?category=423961](https://androphil.tistory.com/759?category=423961) [소림사의 홍반장!]