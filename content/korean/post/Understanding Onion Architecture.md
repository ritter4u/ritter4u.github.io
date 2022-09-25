---
author: Keunreol Park
title:  Understanding Onion Architecture
date: 2022-09-25
description: A brief guide Understanding Onion Architecture
categories: ["Architecture"]
tags: [
    "Onion Architecture",
    "C#"
]
draft : false
---
By [Tapas Pal](https://www.codeguru.com/csharp/understanding-onion-architecture/#:~:text=By-,Tapas%20Pal,-February%2012%2C%202018)
February 12, 2018

출처 : 
https://www.codeguru.com/csharp/understanding-onion-architecture/

[**Table of Contents**] (#toc)
- [What is Onion Architecture?](#what-is-onion-architecture)
- [Principles](#principles)
- [What are Some Problems with Onion Architecture?](#what-are-some-problems-with-onion-architecture)
- [What are the Layers of the Onion Architecture?](#what-are-the-layers-of-the-onion-architecture)
  - [Domain Layer](#domain-layer)
  - [Repository Layer](#repository-layer)
  - [Services Layer](#services-layer)
  - [UI Layer](#ui-layer)
- [Implementation of Onion Architecture](#implementation-of-onion-architecture)
- [Benefits and Drawbacks of Onion Architecture](#benefits-and-drawbacks-of-onion-architecture)
- [Conclusion](#conclusion)

# What is Onion Architecture?
대부분의 기존 아키텍처는 긴밀한 결합 및 관심사 분리라는 근본적인 문제를 제기합니다. Onion Architecture 는 더 나은 테스트 가능성, 유지 관리 가능성 및 신뢰성 측면에서 애플리케이션을 빌드하는 더 나은 방법을 제공하기 위해 [Jeffrey Palermo](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/)에 의해 도입되었습니다. Onion Architecture는 3계층 및 n계층 아키텍처가 직면한 문제를 해결하고 일반적인 문제에 대한 솔루션을 제공합니다. 양파 아키텍처 계층은 인터페이스를 사용하여 서로 상호 작용합니다. C# 프로그래머는 종속성 흐름으로 인해 Onion Architecture에 끌립니다. Onion Architecture로 작업하면서 C#을 더 배우고 싶다면 [TechRepublic Academy](https://academy.techrepublic.com/search?utf8=%E2%9C%93&query=C%2B%2B)를 방문하십시오.

# Principles
Onion Architecture는 제어의 역전(inversion of control )을 기반으로 합니다 . Onion Architecture는 도메인을 나타내는 코어를 향해 서로 인터페이스하는 여러 동심 레이어로 구성됩니다. 아키텍처는 고전적인 다중 계층 아키텍처에서와 같이 데이터 계층에 의존하지 않고 실제 도메인 모델에 의존합니다.

# What are Some Problems with Onion Architecture?
기존 아키텍처에 따라 UI 계층은 비즈니스 로직과 상호 작용하고 비즈니스 로직은 데이터 계층과 통신하며 모든 계층이 혼합되어 서로 크게 의존합니다. 3계층 및 n계층 아키텍처에서는 어떤 계층도 독립적이지 않습니다. 이 사실은 관심사의 분리를 야기합니다. 이러한 시스템은 이해하고 유지하기가 매우 어렵습니다. 이 전통적인 아키텍처의 단점은 불필요한 결합입니다.

![Onion Architecture의 레이어](https://www.codeguru.com/wp-content/uploads/2021/07/Onion1.png)
그림 1: Onion 아키텍처의 계층

Onion Architecture는 코어에서 인프라까지 계층을 정의하여 이러한 문제를 해결했습니다. 모든 커플링을 중심으로 이동시켜 기본 원칙을 적용합니다. 이 아키텍처는 의심할 여지 없이 객체 지향 프로그래밍에 편향되어 있으며 객체를 다른 모든 것보다 우선시합니다. Onion Architecture의 중심에는 비즈니스 및 행동 개체를 나타내는 도메인 모델이 있습니다. 도메인 레이어 주변에는 더 많은 동작이 있는 다른 레이어가 있습니다.

# What are the Layers of the Onion Architecture?
Onion Architecture는 Layer의 개념을 사용하지만 3-tier 및 n-tier 아키텍처 레이어와는 다릅니다. 각 레이어가 무엇을 나타내고 포함해야 하는지 봅시다.

## Domain Layer
Onion Architecture의 중심 부분에는 도메인 레이어가 존재합니다. 이 계층은 비즈니스 및 행동 개체를 나타냅니다. 아이디어는 모든 도메인 개체를 이 핵심에 두는 것입니다. 모든 응용 프로그램 도메인 개체를 보유합니다. 도메인 개체 외에 도메인 인터페이스도 가질 수 있습니다. 이러한 도메인 엔터티에는 종속성이 없습니다. 도메인 개체는 무거운 코드나 종속성 없이 평면적이어야 합니다.

## Repository Layer
이 계층은 도메인 엔터티와 응용 프로그램의 비즈니스 논리 간에 추상화를 만듭니다. 이 계층에서 일반적으로 데이터베이스를 포함하여 객체 저장 및 검색 동작을 제공하는 인터페이스를 추가합니다. 이 계층은 데이터 액세스에 대한 보다 느슨하게 결합된 접근 방식인 데이터 액세스 패턴으로 구성됩니다. 또한 일반 리포지토리를 만들고 쿼리를 추가하여 소스에서 데이터를 검색하고, 데이터 소스에서 비즈니스 항목으로 데이터를 매핑하고, 비즈니스 항목에서 변경 사항을 데이터 소스로 유지합니다.

## Services Layer
서비스 계층에는 추가, 저장, 편집 및 삭제와 같은 일반적인 작업이 포함된 인터페이스가 있습니다. 또한 이 계층은 UI 계층과 저장소 계층 간의 통신에 사용됩니다. 서비스 계층은 엔터티에 대한 비즈니스 논리를 보유할 수도 있습니다. 이 계층에서 서비스 인터페이스는 구현과 분리되어 느슨한 결합과 관심사 분리를 염두에 두고 유지됩니다.

## UI Layer
가장 바깥쪽 레이어이며 UI 및 테스트와 같은 주변 문제를 유지합니다. 웹 응용 프로그램의 경우 Web API 또는 단위 테스트 프로젝트를 나타냅니다. 이 계층에는 종속성 주입 원리가 구현되어 있어 애플리케이션이 느슨하게 결합된 구조를 구축하고 인터페이스를 통해 내부 계층과 통신할 수 있습니다.

# Implementation of Onion Architecture
Onion Architecture 지침에서는 계층을 구현하는 방법에 대한 지침을 제공하지 않습니다. 설계자는 구현을 결정해야 하며 솔루션에 추가하는 데 필요한 클래스, 패키지, 모듈 또는 기타 수준을 자유롭게 선택할 수 있습니다.

# Benefits and Drawbacks of Onion Architecture
다음은 Onion Architecture 구현의 이점입니다.

* Onion Architecture 레이어는 인터페이스를 통해 연결됩니다. 런타임 동안 이식이 제공됩니다.
* 애플리케이션 아키텍처는 도메인 모델 위에 구축됩니다.
* 데이터베이스 액세스 및 서비스 호출과 같은 모든 외부 종속성은 외부 계층에 표시됩니다.
* 내부 레이어와 외부 레이어의 종속성이 없습니다.
* 커플링은 중앙을 향하고 있습니다.
* 유연하고 지속 가능하며 이식 가능한 아키텍처입니다.
* 공통 및 공유 프로젝트를 만들 필요가 없습니다.
* 애플리케이션 코어는 아무 것도 의존하지 않기 때문에 빠르게 테스트할 수 있습니다.

Onion Architecture의 몇 가지 단점은 다음과 같습니다.

* 초보자가 이해하기 쉽지 않으며 학습 곡선이 필요합니다. 건축가는 대부분 레이어 간 책임 분할을 엉망으로 만듭니다.
*  많이 사용되는 인터페이스
# Conclusion
Onion Architecture는 업계에서 널리 받아들여지고 있습니다. 매우 강력하고 두 가지 다른 아키텍처 스타일인 Layered 및 Hexagonal과 밀접하게 연결되어 있습니다. Onion Architecture는 Java 프로그래머보다 C# 프로그래머에게 더 매력적입니다. 그러나 아키텍처를 적용할지 여부에 대한 토론에서 고려하고 논쟁하는 것은 건축가 커뮤니티의 몫입니다.

