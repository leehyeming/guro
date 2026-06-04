# 구로 관광 홈페이지 FRD — AI 입력용 핸드오프 팩

> 본문: `frd-구로관광홈페이지-20260603.md`
> 사용처: Claude Code 시스템 프롬프트, QA 테스트 케이스 작성, 개발자 구현 참조
> 성격: 정밀 데이터 카탈로그. 처음부터 끝까지 읽는 용도가 아니다. 필요한 섹션을 부분 참조한다.

---

## 1. 섹션 ID 카탈로그

| 섹션 ID | 섹션명 | 앵커 URL | Tier | 권한 | 본문 §위치 |
|---------|--------|----------|------|------|-----------|
| S-01 | 헤더 & 네비게이션 | 고정 (sticky) | Tier 1 | 전체 공개 | §5.1 |
| S-02 | 히어로 | `#hero` | Tier 1 | 전체 공개 | §5.2 |
| S-03 | 코스 개요 | `#overview` | Tier 2 | 전체 공개 | v1.x 미구현 |
| S-04 | 추천 동선 지도 | `#route` | Core 1 | 전체 공개 | §5.3 |
| S-05 | 장소별 소개 | `#places` | Core 2 | 전체 공개 | §5.4 |
| S-06 | 맛집 & 먹거리 | `#food` | Tier 1 | 전체 공개 | §5.5 |
| S-07 | 방문 정보 | `#visit` | Tier 1 | 전체 공개 | §5.6 |
| S-08 | SNS 공유 | `#sns` | Tier 3 | 전체 공개 | v2 미구현 |
| S-09 | 푸터 | — | Tier 1 | 전체 공개 | §5.7 |

---

## 2. 권한 매트릭스 (정밀)

로그인 없는 퍼블릭 사이트. 모든 방문자 동일 권한.

| 섹션·기능 ID | 모든 방문자 | 비고 |
|-------------|-------------|------|
| S-01 ~ S-09 전 섹션 열람 | ✅ | 제한 없음 |
| 네비게이션 smooth scroll | ✅ | JS 비활성 시 앵커 링크로 폴백 |
| 카드 hover 효과 | ✅ | 데스크톱 전용 |
| 맨 위로 버튼 | ✅ | — |
| 콘텐츠 편집·관리 | ❌ | CMS 없음, 직접 HTML 수정 |

---

## 3. 요소 ID 카탈로그 (섹션별)

### 3.1 S-01 헤더 & 네비게이션

| 요소 ID | 요소명 | HTML 태그 | 라벨·값 | 동작 |
|---------|--------|-----------|---------|------|
| E-101 | 헤더 컨테이너 | `<header id="header">` | — | position: sticky, top: 0 |
| E-102 | 텍스트 로고 | `<a class="logo">` | "구로를 걷다" | 클릭 → 페이지 최상단 |
| E-103 | 데스크톱 네비 | `<nav class="nav-desktop">` | — | 768px 이상 표시 |
| E-104 | 메뉴 링크 — 코스 소개 | `<a href="#route">` | "코스 소개" | smooth scroll → S-04 |
| E-105 | 메뉴 링크 — 장소 | `<a href="#places">` | "장소" | smooth scroll → S-05 |
| E-106 | 메뉴 링크 — 맛집 | `<a href="#food">` | "맛집" | smooth scroll → S-06 |
| E-107 | 메뉴 링크 — 가는 법 | `<a href="#visit">` | "가는 법" | smooth scroll → S-07 |
| E-108 | 햄버거 버튼 | `<button class="nav-toggle">` | "☰" / "✕" | 탭 → 모바일 메뉴 열림/닫힘 |
| E-109 | 모바일 드롭다운 | `<div class="nav-mobile">` | — | 햄버거 탭 시 display toggle |

**헤더 JS 이벤트:**
```javascript
// 스크롤 감지 → 클래스 토글
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 0);
});

// 모바일 메뉴 외부 탭 닫힘
document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) navMobile.classList.remove('open');
});
```

---

### 3.2 S-02 히어로

| 요소 ID | 요소명 | HTML 태그 | 라벨·값 | 동작 |
|---------|--------|-----------|---------|------|
| E-201 | 히어로 섹션 | `<section id="hero">` | — | 100vh, background-image |
| E-202 | 지역 레이블 | `<span class="hero-label">` | "구로구 항동·오류동" | — |
| E-203 | 코스명 | `<h1 class="hero-title">` | "숲에서 비우고 버들마을에서 채우다" | — |
| E-204 | 한 줄 카피 | `<p class="hero-sub">` | "시간이 멈춘 철길과 6만 평의 숲, 반나절 힐링 코스" | — |
| E-205 | 해시태그 영역 | `<div class="hero-tags">` | #틈새힐링 #구로 #반나절코스 #2030추천 | — |
| E-206 | CTA 버튼 | `<a href="#route" class="hero-cta">` | "코스 보러가기 →" | smooth scroll → S-04 |
| E-207 | 스크롤 유도 | `<div class="scroll-indicator">` | "↓" + 반복 애니메이션 | — |

**Unsplash 이미지 설정:**
```css
#hero {
  background-image: url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80');
  background-size: cover;
  background-position: center;
}
```
OG 이미지도 동일 URL 사용:
```html
<meta property="og:image" content="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80">
```

---

### 3.3 S-04 추천 동선 지도

| 요소 ID | 요소명 | HTML 태그 | 라벨·값 | 동작 |
|---------|--------|-----------|---------|------|
| E-401 | 동선 섹션 | `<section id="route">` | — | — |
| E-402 | 타임라인 컨테이너 | `<div class="timeline">` | — | position: relative |
| E-403 | 세로 연결선 | `::before` pseudo | — | CSS 점선, 초록색 |
| E-404~408 | 장소 아이템 ×5 | `<div class="timeline-item" id="place-N">` | — | — |
| E-404a | 번호 원 | `<div class="step-num">` | "01"~"05" | 클릭 → 해당 카드 스크롤 |
| E-404b | 장소명 링크 | `<a href="#card-N">` | 장소명 | smooth scroll → S-05 해당 카드 |
| E-404c | 소요 시간 뱃지 | `<span class="duration">` | "약 2시간" 등 | — |
| E-409~412 | 이동 구간 ×4 | `<div class="transit">` | 🚶/🚌 + 소요시간 | — |
| E-413 | 총 소요 시간 | `<div class="total-time">` | "총 약 5시간" | — |
| E-414 | SVG 폴백 | `<noscript>` 내 `<ol>` | 장소명 텍스트 목록 | SVG 미지원 시 표시 |

**5개 장소 데이터 (순서·ID 고정):**

| place-N | 장소명 | card-N 연결 | 소요 시간 | 다음 이동 |
|---------|--------|-------------|-----------|-----------|
| place-1 | 푸른수목원 | card-1 | 약 2시간 | 🚶 도보 5분 |
| place-2 | 항동푸른도서관 | card-2 | 자유 | 🚶 도보 5분 |
| place-3 | KB숲교육센터 | card-3 | 약 15분 | 🚶 도보 10분 |
| place-4 | 항동철길 | card-4 | 약 25분 | 🚌 버스 이동 |
| place-5 | 오류버들마을 | card-5 | 약 2시간 | — |

---

### 3.4 S-05 장소별 소개 카드

| 요소 ID | 요소명 | HTML 태그 | 라벨·값 | 동작 |
|---------|--------|-----------|---------|------|
| E-501 | 장소 섹션 | `<section id="places">` | — | — |
| E-502 | 카드 그리드 | `<div class="places-grid">` | — | display: grid, 2열 |
| E-503~507 | 장소 카드 ×5 | `<div class="place-card" id="card-N">` | — | hover: translateY(-3px) |
| E-503a | 이미지 영역 | `<div class="place-img">` | 이모지 + 그라디언트 | onerror 폴백 |
| E-503b | STEP 뱃지 | `<span class="step-badge">` | "STEP 01"~"STEP 05" | — |
| E-503c | 장소명 | `<h3 class="place-name">` | 장소명 | — |
| E-503d | 매력 포인트 | `<p class="place-highlight">` | 1~2줄 설명 | — |
| E-503e | 방문 팁 | `<div class="place-tip">` | 💡 + 팁 텍스트 | — |

**실사진 교체 방법:**
```html
<!-- 현재 (플레이스홀더) -->
<div class="place-img">🌳</div>

<!-- 교체 후 -->
<img class="place-img" src="./images/arboretum.jpg" alt="푸른수목원"
     onerror="this.outerHTML='<div class=\'place-img\'>🌳</div>'">
```

**CSS text-overflow 처리 (텍스트 넘침 방지):**
```css
.place-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.place-highlight {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

### 3.5 S-06 맛집 & 먹거리

| 요소 ID | 요소명 | HTML 태그 | 라벨·값 | 동작 |
|---------|--------|-----------|---------|------|
| E-601 | 맛집 섹션 | `<section id="food">` | — | background: var(--warm) |
| E-602 | 메뉴 그리드 | `<div class="food-grid">` | — | display: grid, 3열 |
| E-603~608 | 메뉴 카드 ×6 | `<div class="food-card">` | — | hover 효과 |
| E-609 | 하단 안내문 | `<p class="food-notice">` | 골목 특성 안내 | — |

---

### 3.6 S-07 방문 정보

| 요소 ID | 요소명 | HTML 태그 | 라벨·값 | 동작 |
|---------|--------|-----------|---------|------|
| E-701 | 방문 정보 섹션 | `<section id="visit">` | — | background: 연한 초록 |
| E-702 | 교통 블록 | `<div class="visit-block">` | "교통 안내" | — |
| E-703 | 주의사항 블록 | `<div class="visit-block">` | "주의사항" | — |
| E-704 | 비용 블록 | `<div class="visit-block">` | "예상 비용" | — |

---

### 3.7 S-09 푸터

| 요소 ID | 요소명 | HTML 태그 | 라벨·값 | 동작 |
|---------|--------|-----------|---------|------|
| E-901 | 푸터 | `<footer>` | — | background: var(--forest) |
| E-902 | 로고 | `<div class="footer-logo">` | "구로를 걷다" | — |
| E-903 | 출처 | `<p class="footer-source">` | "구로 지역 현장답사 결과 발표 · GLOWIDE" | — |
| E-904 | 작성자 | `<p>` | "이혜민" | — |
| E-905 | 저작권 | `<p class="footer-copy">` | "© 2026 구로를 걷다. All rights reserved." | — |
| E-906 | 맨 위로 버튼 | `<button class="back-to-top">` | "↑ 맨 위로" | 클릭 → 최상단 smooth scroll |

---

## 4. 메타 정보 & 이미지 교체 규칙

### 4.1 필수 메타 태그 (head에 삽입)

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>구로를 걷다 — 숲에서 비우고 버들마을에서 채우다</title>
  <meta name="description" content="구로구 항동·오류동 반나절 힐링 코스. 6만 평 숲, 시간이 멈춘 철길, 오류버들마을 로컬 맛집을 5시간에 즐기는 코스 안내.">

  <!-- Open Graph (카카오·인스타 링크 공유 미리보기) -->
  <meta property="og:title" content="구로를 걷다 — 숲에서 비우고 버들마을에서 채우다">
  <meta property="og:description" content="구로구 항동·오류동 반나절 힐링 코스. 6만 평 숲, 시간이 멈춘 철길, 오류버들마을.">
  <meta property="og:image" content="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80">
  <meta property="og:type" content="website">

  <!-- Favicon (탭 아이콘) -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌳</text></svg>">
</head>
```

### 4.2 실사진 교체 시 수정 위치

| 항목 | 수정 위치 | 수정 방법 |
|------|-----------|-----------|
| 히어로 배경 | CSS `#hero { background-image: url(...) }` | URL 교체 1줄 |
| OG 이미지 | `<meta property="og:image" content="...">` | URL 교체 1줄 |
| 장소 카드 이미지 | `<img src="..." onerror="...">` ×5 | src 교체, onerror 유지 |
| favicon | `<link rel="icon">` | SVG 이모지 또는 .ico 파일 경로 |

---

## 5. 인수 기준 (Acceptance Criteria) — 섹션별

### 5.1 S-01 헤더 공통

- [ ] 페이지 열자마자 헤더가 최상단에 노출됨
- [ ] 1px 이상 스크롤 시 헤더 배경이 즉시 짙어짐
- [ ] 최상단 복귀 시 헤더 배경이 원래대로 돌아옴
- [ ] 모바일(375px)에서 햄버거 버튼 탭 시 드롭다운 열림
- [ ] 드롭다운 열린 상태에서 외부 영역 탭 시 드롭다운 닫힘
- [ ] 드롭다운 항목 탭 시 메뉴 닫히고 해당 섹션으로 이동

### 5.2 S-02 히어로

- [ ] 페이지 진입 2초 이내 텍스트 요소 전체 표시
- [ ] Unsplash 이미지 로딩 실패 시 그라디언트 배경 자동 유지
- [ ] "코스 보러가기" 탭 시 S-04로 smooth scroll
- [ ] JS 비활성 환경에서 CTA 버튼이 앵커 링크로라도 동작

### 5.3 S-04 동선 지도 (Core 1)

- [ ] 5개 장소 모두 올바른 순서로 표시
- [ ] 장소명 탭 시 S-05 해당 카드로 이동
- [ ] SVG 미지원 브라우저에서 텍스트 목록 폴백 노출
- [ ] 모바일(375px)에서 가로 스크롤 발생하지 않음
- [ ] 가로 모드(landscape)에서 레이아웃 정상 표시

### 5.4 S-05 장소 카드 (Core 2)

- [ ] 5개 카드 추천 동선 순서(수목원→도서관→KB→철길→버들마을)로 표시
- [ ] 섹션 뷰포트 진입 시 카드 순차 페이드인 동작
- [ ] 실사진 이미지 깨짐 시 그라디언트 자동 복원
- [ ] 장소명이 길어도 카드 밖으로 넘치지 않음
- [ ] 768px 미만 화면에서 1열 표시
- [ ] 데스크톱 hover 시 카드 3px 이동 + 그림자 변화

### 5.5 S-06 ~ S-09 공통

- [ ] 각 섹션 뷰포트 진입 시 페이드인 동작
- [ ] 푸터 "↑ 맨 위로" 탭 시 최상단으로 smooth scroll

### 5.6 전체 공통

- [ ] `<title>` 태그 브라우저 탭에 정상 표시
- [ ] 카카오톡 링크 공유 시 OG 미리보기(제목·설명·이미지) 정상 노출
- [ ] favicon 브라우저 탭 아이콘 표시
- [ ] 모든 텍스트 모바일(375px)에서 가로 스크롤 없이 표시

---

## 6. 인터랙션 명세 (이벤트 → 결과 정밀)

| 섹션 | 이벤트 | 대상 요소 | 동작 | 애니메이션 |
|------|--------|-----------|------|-----------|
| S-01 | scroll | window | 헤더 `.scrolled` 클래스 토글 | transition: background 0.3s |
| S-01 | click | E-108 햄버거 | 드롭다운 open 토글 | — |
| S-01 | click | document 외부 | 드롭다운 닫힘 | — |
| S-01 | click | E-104~107 메뉴 | smooth scroll | scroll-behavior: smooth |
| S-02 | DOMContentLoaded | E-202~206 | 순차 페이드인 | animation-delay: 0.2s 간격 |
| S-02 | click | E-206 CTA | S-04 smooth scroll | — |
| S-04 | DOMContentLoaded | E-401 | 0.3초 페이드인 | animation: fadeIn 0.3s |
| S-04 | click | E-404b 장소명 | S-05 해당 카드 scroll | smooth |
| S-05 | IntersectionObserver | E-503~507 카드 | 순차 페이드인 | animation-delay: 0.1s 간격 |
| S-05 | mouseenter | 카드 | translateY(-3px) + 그림자 | transition: 0.25s |
| S-05 | error | `<img>` | onerror 그라디언트 복원 | — |
| S-09 | click | E-906 맨 위로 | window.scrollTo(0,0) | smooth |

---

## 7. 외부 의존성 상세

| 서비스 | 용도 | URL | 인증 | 누락 시 폴백 |
|--------|------|-----|------|------------|
| Unsplash CDN | 히어로 배경 이미지 | `https://images.unsplash.com/photo-{id}?w=1920&q=80` | 불필요 (공개 CDN) | CSS 그라디언트 `background: linear-gradient(...)` |
| Google Fonts CDN | Noto Sans KR, Noto Serif KR | `https://fonts.googleapis.com/css2?family=...` | 불필요 | 시스템 폰트 `'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif` |

**추천 Unsplash 사진 ID (숲 테마):**
- `photo-1448375240586-882707db888b` — 울창한 숲 길
- `photo-1542273917363-3b1817f69a2d` — 숲 속 햇살
- `photo-1448375240586-882707db888b` — 초록 숲 전경

---

## 8. 5개 상태 상세 (섹션별 정밀표)

### S-04 동선 지도

| 상태 | 보이는 것 | 가능한 액션 | 시스템 처리 |
|------|-----------|-------------|------------|
| Success | 타임라인 SVG 완전 렌더링, 5개 장소 | 장소명 클릭 | smooth scroll |
| Loading | 0.3초 fadeIn 중 | 없음 | CSS animation |
| Error | ol/li 텍스트 목록 (SVG 폴백) | 없음 (링크는 유지) | noscript/fallback |
| Empty | N/A (하드코딩) | — | — |
| Disabled | 장소명 클릭 시 앵커 링크만 (JS 없음) | 앵커 이동 | href 기본 동작 |

### S-05 장소 카드

| 상태 | 보이는 것 | 가능한 액션 | 시스템 처리 |
|------|-----------|-------------|------------|
| Success | 카드 5개 2열 그리드 | hover (데스크톱) | CSS transition |
| Loading | 순차 페이드인 중 | 없음 | Intersection Observer |
| Error | 이미지 깨짐 → 그라디언트 복원 | 없음 | onerror 속성 |
| Empty | N/A (하드코딩) | — | — |
| Disabled | N/A (클릭 액션 없음) | — | — |

---

## 9. Blindspot Check 상세 결과

### 9.1 화면 상태 정의 누락
전 섹션 5개 상태 정의 완료. 누락 없음.

### 9.2 예외 흐름 — v1 추가 확정 6건

| # | 항목 | 처리 방법 | 구현 위치 |
|---|------|-----------|-----------|
| 1 | 모바일 메뉴 외부 탭 자동 닫힘 | `document.addEventListener('click', ...)` | header JS |
| 2 | 모바일 가로 모드 CSS 분기 | `@media (orientation: landscape) { ... }` | CSS 미디어 쿼리 |
| 3 | 카드 텍스트 넘침 방지 | `text-overflow: ellipsis`, `-webkit-line-clamp: 2` | .place-name, .place-highlight CSS |
| 4 | `<title>` 태그 | "구로를 걷다 — 숲에서 비우고 버들마을에서 채우다" | `<head>` |
| 5 | OG 태그 (og:title, og:description, og:image) | Unsplash URL 재활용 | `<head>` |
| 6 | favicon | SVG 이모지 data URI | `<head>` |

### 9.3 권한 모호
없음. 퍼블릭 단일 등급으로 단순.

### 9.4 검증 누락
입력 필드 없음. 이미지 교체 규칙은 §4.2에 정의.

### 9.5 엣지 케이스 처리 현황

| 엣지 케이스 | v1 처리 | 방법 |
|-------------|---------|------|
| 이미지 깨짐 | ✅ | onerror 폴백 |
| SVG 미지원 | ✅ | noscript 텍스트 목록 |
| iOS smooth scroll 미지원 | ✅ | JS 폴리필 |
| Intersection Observer 미지원 | ⚠️ 의도적 미룸 | 페이드인 생략, 즉시 표시 |
| 가로 모드 | ✅ | CSS landscape 분기 |
| 매우 긴 텍스트 | ✅ | text-overflow 처리 |
| 다크 모드 | ❌ v1.x 미룸 | — |
| 인쇄 CSS | ❌ 의도적 생략 | 요청 발생 시 추가 |

---

## 10. 미해결 / TRD에서 결정할 항목

이 프로젝트는 정적 HTML이라 TRD가 필요하지 않습니다. 대신 v1.x·v2에서 처리할 항목을 정리합니다.

| 항목 | 시기 | 이유 |
|------|------|------|
| S-03 코스 개요 섹션 구현 | v1.x | 현재 Core 없이도 목적 달성 가능 |
| S-08 SNS 공유 버튼 | v2 | 해시태그 복사·카카오 공유 SDK 필요 |
| 카카오맵 API 연동 | v2 | API 키 발급 후 정적 타임라인 교체 |
| 실사진 교체 | 사진 준비 후 | §4.2 교체 방법 참조 |
| 다크 모드 CSS | v1.x | `@media (prefers-color-scheme: dark)` |
| Intersection Observer 폴리필 | v1.x | 구형 브라우저 대응 필요 시 |

---

## 11. TRD 작성 시 사용할 핵심 변수

이 프로젝트는 정적 HTML이므로 TRD 대신 개발자가 참조할 핵심 변수를 정리합니다.

| 변수 | 값 |
|------|-----|
| 파일 구조 | 단일 index.html (CSS·JS 인라인 또는 분리) |
| 섹션 총수 | 9개 |
| v1 구현 섹션 | 7개 (S-01, S-02, S-04, S-05, S-06, S-07, S-09) |
| Core 섹션 | S-04 (동선 지도), S-05 (장소 카드) |
| 외부 의존성 | Unsplash CDN, Google Fonts CDN |
| 브레이크포인트 | 768px (1열/2열/3열 전환) |
| 주요 JS 기능 | scroll 감지, 햄버거 메뉴, smooth scroll 폴리필, Intersection Observer |
| 배포 환경 | GitHub Pages / Netlify (정적 파일 업로드) |
| 추정 개발 시간 (1인) | 3~5일 |
| 장소 데이터 수 | 5개 (구두인관 제외 확정) |
| 맛집 카드 수 | 6개 |
| Unsplash 사진 ID | 1448375240586-882707db888b (교체 가능) |

---

## 12. Claude Code 입력용 시스템 프롬프트

다음을 Claude Code에 붙여넣어 홈페이지 코드를 생성하세요.

```
구로 관광 홈페이지 HTML 파일 1개를 생성해줘.

[서비스 개요]
- 구로구 항동·오류동 반나절 힐링 코스 소개 정적 웹사이트
- 단일 index.html, CSS·JS 인라인 포함
- 한국어 서비스, 모바일 반응형 (브레이크포인트: 768px)

[필수 섹션 7개, 위에서 아래 순서]
1. 헤더: sticky, 로고 "구로를 걷다", 메뉴(코스소개/장소/맛집/가는법), 모바일 햄버거 메뉴
2. 히어로: Unsplash 숲 사진 배경, 코스명, 카피, 해시태그, CTA 버튼
3. 동선 지도 (#route): 세로 타임라인, 5개 장소, 🚶/🚌 이동 아이콘+시간
4. 장소 카드 (#places): 2열 그리드, 5개 카드, 그라디언트+이모지 플레이스홀더
5. 맛집 (#food): 3열 그리드, 6개 메뉴 카드, 이모지+설명
6. 방문 정보 (#visit): 3블록 (교통/주의사항/비용), 연한 초록 배경
7. 푸터: 로고, 출처, 저작권, 맨위로 버튼

[5개 장소 데이터 (순서 고정)]
1. 푸른수목원 🌳 / 약 2시간 / 도심 속 6만 평 오아시스 / 쓰레기통 없음
2. 항동푸른도서관 📚 / 자유 / 숲 속 독서 / 1층 큐레이션 전시 확인
3. KB숲교육센터 🌿 / 약 15분 / 유리온실 허브·열대식물 / 화장실·정수기
4. 항동철길 🚂 / 약 25분 / 1959년 준공 낭만 철길 / 그늘 없음 양산 필수
5. 오류버들마을 🍖 / 약 2시간 / 로컬 브랜드 성지 / 골목별 분산

[이동 구간]
1→2: 🚶 도보 5분 / 2→3: 🚶 도보 5분 / 3→4: 🚶 도보 10분 / 4→5: 🚌 버스 이동

[6개 맛집]
감자옹심이🥣, 수제버거🍔, 통닭🍗, 부대찌개🍲, 브런치☕, 빵·베이커리🥐

[기술 요구사항]
- Google Fonts: Noto Sans KR + Noto Serif KR
- Unsplash: https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80
- OG 태그, title 태그, favicon(🌳 SVG) 포함
- 스크롤 시 헤더 배경 변화, 모바일 햄버거 메뉴 외부탭 닫힘
- 장소명 클릭 시 해당 카드로 smooth scroll
- Intersection Observer 카드 페이드인
- iOS smooth scroll 폴리필
- 이미지 onerror 폴백, 텍스트 overflow ellipsis 처리
- 모바일 가로 모드 CSS 분기
- 컬러 팔레트: forest #1a3a1f / leaf #4a7c59 / gold #c4a24a / cream #faf7f2
```
