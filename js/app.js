document.addEventListener('DOMContentLoaded', () => {
  // ── THEME SWITCHER LOGIC ──
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    if (theme === 'dark') {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      themeToggleBtns.forEach(btn => {
        btn.innerHTML = '☀️';
        btn.setAttribute('aria-label', '라이트 모드로 변경');
        btn.setAttribute('title', '라이트 모드로 변경');
      });
    } else {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      themeToggleBtns.forEach(btn => {
        btn.innerHTML = '🌙';
        btn.setAttribute('aria-label', '다크 모드로 변경');
        btn.setAttribute('title', '다크 모드로 변경');
      });
    }
    localStorage.setItem('theme', theme);
    
    // Dispatch custom event to trigger animations or recalculations if needed
    window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme } }));
  };

  // Initialize Theme
  const currentTheme = getPreferredTheme();
  setTheme(currentTheme);

  // Bind Toggle Events
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('theme-dark');
      setTheme(isDark ? 'light' : 'dark');
    });
  });

  // ── HEADER & MOBILE NAVIGATION ──
  const hdr = document.getElementById('hdr');
  const mBtn = document.getElementById('mBtn');
  const mnav = document.getElementById('mnav');

  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    hdr.classList.toggle('on', window.scrollY > 0);
  }, { passive: true });

  // Toggle Mobile Menu
  mBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mnav.classList.toggle('open');
    mBtn.textContent = isOpen ? '✕' : '☰';
    mBtn.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  // Close Mobile Menu on Click Outside
  document.addEventListener('click', (e) => {
    if (!hdr.contains(e.target)) {
      mnav.classList.remove('open');
      mBtn.textContent = '☰';
      mBtn.setAttribute('aria-label', '메뉴 열기');
    }
  });

  // Close Mobile Menu on Link Click
  mnav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mnav.classList.remove('open');
      mBtn.textContent = '☰';
      mBtn.setAttribute('aria-label', '메뉴 열기');
    });
  });

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 68;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── PARALLAX HERO BACKGROUND (Desktop Only) ──
  const heroBg = document.getElementById('hbg');
  const heroEl = document.getElementById('hero');
  const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!isMobileDevice && heroBg && heroEl) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = heroEl.offsetHeight;
      if (scrollY < heroHeight + 100) {
        // Different speed coefficient based on active theme layout
        const speed = document.body.classList.contains('theme-light') ? 0.28 : 0.3;
        heroBg.style.transform = `translateY(${scrollY * speed}px)`;
      }
    }, { passive: true });
  }

  // ── STATS COUNT-UP ANIMATION ──
  let counted = false;
  const countUpObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll('.cnt').forEach(el => {
        const targetValue = parseInt(el.dataset.t, 10);
        let currentValue = 0;
        const duration = 1200; // ms
        const increment = targetValue / (duration / 55);
        
        const counterInterval = setInterval(() => {
          currentValue = Math.min(currentValue + increment, targetValue);
          el.textContent = Math.floor(currentValue);
          
          if (currentValue >= targetValue) {
            el.textContent = targetValue;
            clearInterval(counterInterval);
          }
        }, 55);
      });
    }
  }, { threshold: 0.6 });

  const sbar = document.querySelector('.sbar');
  if (sbar) countUpObserver.observe(sbar);

  // ── INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ──
  
  // 1. Place cards fade-in
  const pcards = [...document.querySelectorAll('.pc')];
  const placesSection = document.getElementById('places');
  
  if (placesSection && pcards.length > 0) {
    const placesObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          pcards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('in');
            }, index * 100);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    placesObserver.observe(placesSection);
  }

  // 2. Food cards and Visit blocks fade-in
  const animateOnScroll = (selector, delayIncrement = 75, thresholdValue = 0.08) => {
    const section = document.querySelector(selector);
    if (!section) return;
    
    const items = [...section.querySelectorAll('.fc, .vb, .sns-card')];
    
    // Initial styles
    items.forEach(el => {
      el.classList.remove('in');
    });

    const observer = new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        items.forEach((el, i) => {
          setTimeout(() => {
            el.classList.add('in');
          }, i * delayIncrement);
        });
        obs.unobserve(section);
      }
    }, { threshold: thresholdValue });
    observer.observe(section);
  };

  animateOnScroll('#food', 75, 0.08);
  animateOnScroll('#visit', 100, 0.08);
  animateOnScroll('#sns', 100, 0.08);

  // Re-run animations trigger when theme changes to recalculate layouts
  window.addEventListener('themechanged', () => {
    // Reset entry class for a fresh animation trigger in new layout
    const allAnimated = document.querySelectorAll('.pc, .fc, .vb, .sns-card');
    allAnimated.forEach(el => {
      el.classList.add('in'); // Instantly show cards when theme toggled to avoid weird state delays
    });
  });

  // ── FEATURE 4: WALKING SIMULATION LOGIC ──
  const simPlayBtn = document.getElementById('sim-play-btn');
  const simResetBtn = document.getElementById('sim-reset-btn');
  const walkerAvatar = document.getElementById('walker-avatar');
  const simSteps = document.getElementById('sim-steps');
  const simCal = document.getElementById('sim-cal');
  const simLoc = document.getElementById('sim-loc');
  
  const pins = [
    { name: '01 푸른수목원 🌳', el: document.getElementById('pin-1'), card: document.getElementById('card-1'), threshold: 0 },
    { name: '02 항동도서관 📚', el: document.getElementById('pin-2'), card: document.getElementById('card-2'), threshold: 22 },
    { name: '03 KB숲교육센터 🌿', el: document.getElementById('pin-3'), card: document.getElementById('card-3'), threshold: 46 },
    { name: '04 항동철길 🚂', el: document.getElementById('pin-4'), card: document.getElementById('card-4'), threshold: 68 },
    { name: '05 오류버들마을 🍖 (도착!)', el: document.getElementById('pin-5'), card: document.getElementById('card-5'), threshold: 92 }
  ];

  let simInterval = null;
  let distance = 0; // 0% to 100%
  let isWalking = false;

  const updateSimulationStats = () => {
    // 0 to 100% maps to 0 to 8500 steps, and 0 to 340 calories
    const steps = Math.floor(8500 * (distance / 100));
    const calories = Math.floor(340 * (distance / 100));
    
    simSteps.textContent = steps.toLocaleString();
    simCal.textContent = calories;
    
    // Find active location
    let currentLocation = '출발 대기';
    let activePinIdx = -1;
    
    for (let i = pins.length - 1; i >= 0; i--) {
      if (distance >= pins[i].threshold) {
        currentLocation = pins[i].name;
        activePinIdx = i;
        break;
      }
    }
    
    simLoc.textContent = currentLocation;
    
    // Highlight pin in SVG
    pins.forEach((pin, idx) => {
      if (idx === activePinIdx) {
        pin.el.classList.add('active');
      } else {
        pin.el.classList.remove('active');
      }
    });
  };

  const playSimulation = () => {
    if (isWalking) {
      // Pause
      clearInterval(simInterval);
      simPlayBtn.textContent = '▶ 모의 걷기 시작';
      isWalking = false;
    } else {
      // Start/Resume
      walkerAvatar.style.display = 'block';
      simPlayBtn.textContent = '⏸ 일시 정지';
      isWalking = true;
      
      simInterval = setInterval(() => {
        distance += 0.5; // step increment
        if (distance > 100) {
          distance = 100;
          clearInterval(simInterval);
          simPlayBtn.textContent = '완료! 🎉';
          simPlayBtn.disabled = true;
          isWalking = false;
          triggerConfetti(); // Spark confetti at destination
        }
        
        walkerAvatar.style.offsetDistance = `${distance}%`;
        updateSimulationStats();
      }, 60); // Speed: approx 12 seconds for full walk
    }
  };

  const resetSimulation = () => {
    clearInterval(simInterval);
    distance = 0;
    isWalking = false;
    walkerAvatar.style.offsetDistance = '0%';
    walkerAvatar.style.display = 'none';
    simPlayBtn.textContent = '▶ 모의 걷기 시작';
    simPlayBtn.disabled = false;
    
    pins.forEach(pin => pin.el.classList.remove('active'));
    
    updateSimulationStats();
    simLoc.textContent = '대기 중';
  };

  if (simPlayBtn && simResetBtn) {
    simPlayBtn.addEventListener('click', playSimulation);
    simResetBtn.addEventListener('click', resetSimulation);
  }


  // ── FEATURE 2: MENU ROULETTE LOGIC ──
  const rouletteWheel = document.getElementById('roulette-wheel');
  const rouletteSpinBtn = document.getElementById('roulette-spin-btn');
  const rouletteResult = document.getElementById('roulette-result');
  const resultEmoji = document.getElementById('result-emoji');
  const resultText = document.getElementById('result-text');
  const resultDesc = document.getElementById('result-desc');
  const resultScrollBtn = document.getElementById('result-scroll-btn');

  const menuItems = [
    { name: '감자옹심이 🥣', emoji: '🥣', desc: '강원도 전통 옹심이 수제비! 고소한 국물이 걷느라 지친 하루 피로를 풀어줍니다.', index: 0, selector: '#food .fgrid .fc:nth-child(1)' },
    { name: '수제버거 🍔', emoji: '🍔', desc: '육즙 가득 버거! 힙한 동네 버거샵에서 감각적인 한 끼 식사를 곁들여 보세요.', index: 1, selector: '#food .fgrid .fc:nth-child(2)' },
    { name: '가마솥 통닭 🍗', emoji: '🍗', desc: '바삭하고 짭조름한 가마솥 옛날통닭과 함께 시원한 맥주 한 잔의 여유를 부려보세요.', index: 2, selector: '#food .fgrid .fc:nth-child(3)' },
    { name: '부대찌개 🍲', emoji: '🍲', desc: '햄과 소시지가 듬뿍 끓어오르는 뚝배기 밥집! 든든하게 먹고 다시 힘차게 걸을 수 있습니다.', index: 3, selector: '#food .fgrid .fc:nth-child(4)' },
    { name: '브런치 & 브루잉 ☕', emoji: '☕', desc: '빈티지 정원의 감성을 품은 카페! 향긋한 핸드드립 커피와 오픈 샌드위치를 즐겨 보세요.', index: 4, selector: '#food .fgrid .fc:nth-child(5)' },
    { name: '베이커리 🥐', emoji: '🥐', desc: '직접 밀가루를 반죽해 갓 구운 천연발효 크루아상! 달콤하고 바삭한 버터 향으로 코스를 매듭지으세요.', index: 5, selector: '#food .fgrid .fc:nth-child(6)' }
  ];

  let currentSpins = 5;

  const spinRoulette = () => {
    if (!rouletteWheel) return;
    rouletteSpinBtn.disabled = true;
    rouletteResult.style.display = 'none';
    
    // Choose random menu (0 to 5)
    const targetIdx = Math.floor(Math.random() * menuItems.length);
    const selectedMenu = menuItems[targetIdx];
    
    // Calculate final rotation
    currentSpins += 5; // Add extra spins
    const offset = Math.random() * 40 - 20; // Wobble pointer
    const totalRotation = (currentSpins * 360) + 240 - (targetIdx * 60) + offset;
    
    rouletteWheel.style.transform = `rotate(${totalRotation}deg)`;
    
    // Wait for animation (4s)
    setTimeout(() => {
      // Show result
      resultEmoji.textContent = selectedMenu.emoji;
      resultText.textContent = selectedMenu.name;
      resultDesc.textContent = selectedMenu.desc;
      
      // Update link target to corresponding card
      resultScrollBtn.setAttribute('href', selectedMenu.selector);
      
      rouletteResult.style.display = 'block';
      rouletteSpinBtn.disabled = false;
      
      // Flash the selected card on the food grid
      const foodCards = document.querySelectorAll('#food .fc');
      foodCards.forEach(c => c.style.outline = 'none');
      const targetCard = document.querySelector(selectedMenu.selector);
      if (targetCard) {
        targetCard.style.outline = '3px solid var(--gold)';
        targetCard.style.borderRadius = '12px';
        targetCard.style.transition = 'outline 0.3s ease';
        setTimeout(() => {
          targetCard.style.outline = 'none';
        }, 3000);
      }
      
      triggerConfetti();
    }, 4100);
  };

  if (rouletteSpinBtn) {
    rouletteSpinBtn.addEventListener('click', spinRoulette);
  }


  // ── HELPER: CONFETTI EXPLOSION ──
  const triggerConfetti = () => {
    const containers = [document.querySelector('.roulette-box'), document.querySelector('.sim-controls')];
    const container = containers[0] || document.body;
    const emojis = ['🎉', '🍔', '🥣', '🍗', '🍲', '☕', '🥐', '✨', '🌳', '❤️'];
    
    for (let i = 0; i < 35; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = '50%';
      el.style.top = '50%';
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = 60 + Math.random() * 140;
      const x = Math.cos(angle) * velocity;
      const y = Math.sin(angle) * velocity - 60; // Bias up
      
      el.style.setProperty('--x', `${x}px`);
      el.style.setProperty('--y', `${y}px`);
      
      const duration = 0.8 + Math.random() * 1.2;
      el.style.animation = `confettiFly ${duration}s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`;
      
      container.appendChild(el);
      setTimeout(() => el.remove(), duration * 1000);
    }
  };

  // ── FEATURE 1: HEALING QUIZ LOGIC ──
  const quizStartBtn = document.getElementById('quiz-start-btn');
  const quizCloseBtn = document.getElementById('quiz-close-btn');
  const quizModal = document.getElementById('quiz-modal');
  const quizBeginBtn = document.getElementById('quiz-begin-btn');
  
  const quizStates = {
    intro: document.getElementById('quiz-state-intro'),
    q1: document.getElementById('quiz-state-q1'),
    q2: document.getElementById('quiz-state-q2'),
    q3: document.getElementById('quiz-state-q3'),
    result: document.getElementById('quiz-state-result')
  };
  
  const quizResEmoji = document.getElementById('quiz-res-emoji');
  const quizResTitle = document.getElementById('quiz-res-title');
  const quizResDesc = document.getElementById('quiz-res-desc');
  const quizGoBtn = document.getElementById('quiz-go-btn');
  const quizShareBtn = document.getElementById('quiz-share-btn');
  
  let quizAnswers = [];
  let quizTargetSelector = '#places';

  const showQuizState = (stateName) => {
    Object.keys(quizStates).forEach(key => {
      if (quizStates[key]) quizStates[key].style.display = key === stateName ? 'flex' : 'none';
    });
  };

  const resetQuiz = () => {
    quizAnswers = [];
    showQuizState('intro');
  };

  if (quizStartBtn && quizModal) {
    quizStartBtn.addEventListener('click', () => {
      resetQuiz();
      quizModal.style.display = 'flex';
    });
    
    quizCloseBtn.addEventListener('click', () => {
      quizModal.style.display = 'none';
      resetQuiz();
    });
    
    // Close modal when clicking on overlay
    quizModal.addEventListener('click', (e) => {
      if (e.target === quizModal) {
        quizModal.style.display = 'none';
        resetQuiz();
      }
    });
    
    quizBeginBtn.addEventListener('click', () => {
      showQuizState('q1');
    });
  }

  // Answer selection transitions
  document.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', function() {
      const type = this.dataset.type;
      quizAnswers.push(type);
      
      const currentParent = this.closest('.quiz-state');
      if (currentParent.id === 'quiz-state-q1') {
        showQuizState('q2');
      } else if (currentParent.id === 'quiz-state-q2') {
        showQuizState('q3');
      } else if (currentParent.id === 'quiz-state-q3') {
        calculateQuizResult();
      }
    });
  });

  const calculateQuizResult = () => {
    const counts = { A: 0, B: 0, C: 0 };
    quizAnswers.forEach(ans => counts[ans]++);
    
    let resultType = 'A';
    if (counts.B > counts.A && counts.B >= counts.C) {
      resultType = 'B';
    } else if (counts.C > counts.A && counts.C > counts.B) {
      resultType = 'C';
    } else if (counts.A >= counts.B && counts.A >= counts.C) {
      resultType = 'A';
    } else {
      resultType = quizAnswers[0];
    }
    
    // Result configuration
    let title = '';
    let emoji = '';
    let desc = '';
    
    if (resultType === 'A') {
      title = '사색에 잠긴 숲속 여행자';
      emoji = '🌳';
      desc = '조용하고 푸르른 대자연과 호흡하며 마음에 평화를 얻는 사색가 타입입니다. 6만 평 푸른수목원의 드넓은 저수지 산책로와 숲속 깊숙이 파묻힌 항동도서관에서의 평온한 독서를 추천합니다!';
      quizTargetSelector = '#card-1';
    } else if (resultType === 'B') {
      title = '발길 닿는 대로 철길 탐험가';
      emoji = '🚂';
      desc = '시간이 멈춘 듯 이색적인 길을 걸으며 옛 낭만을 만끽하는 모험가 타입입니다. 1959년 준공된 낭만 가득한 옛 항동철길 위를 천천히 따라 걸으며 추억의 사진을 찍는 코스가 가장 어울려요!';
      quizTargetSelector = '#card-4';
    } else {
      title = '로컬 골목을 개척하는 낭만 미식가';
      emoji = '🍖';
      desc = '소소한 상점가와 아기자기한 골목 사이에 숨겨진 힙한 맛집, 디저트 베이커리를 찾아 탐험하는 미식가 타입입니다. 구로구 오류버들마을만의 개성 가득한 맛집과 빵집을 탐방해보세요!';
      quizTargetSelector = '#food';
    }
    
    quizResEmoji.textContent = emoji;
    quizResTitle.textContent = title;
    quizResDesc.textContent = desc;
    
    showQuizState('result');
    triggerConfetti();
  };

  // Result actions
  if (quizGoBtn) {
    quizGoBtn.addEventListener('click', () => {
      quizModal.style.display = 'none';
      
      const targetEl = document.querySelector(quizTargetSelector);
      if (targetEl) {
        const headerOffset = 68;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }

  if (quizShareBtn) {
    quizShareBtn.addEventListener('click', () => {
      const typeText = quizResTitle.textContent;
      const emojiText = quizResEmoji.textContent;
      const shareUrl = window.location.href.split('#')[0];
      const textToCopy = `🧭 [구로를 걷다] 나의 힐링 성향 분석 결과:\n\n✨ 유형: ${typeText} ${emojiText}\n\n나에게 꼭 맞는 구로구의 숨겨진 반나절 힐링 코스 찾기! 👇\n${shareUrl}`;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = quizShareBtn.textContent;
        quizShareBtn.textContent = '복사 완료! 📋';
        setTimeout(() => {
          quizShareBtn.textContent = originalText;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }

  // ── FEATURE 5: KAKAO MAP INTEGRATION ──
  const KAKAO_KEY = 'dbebd1c2db9429fc97be63abf56e482d'; // Replace with user's Kakao Javascript Key
  
  const mapSection = document.getElementById('visit-map');
  if (mapSection) {
    const mapObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        mapSection.classList.add('in');
        mapObserver.unobserve(mapSection);
      }
    }, { threshold: 0.15 });
    mapObserver.observe(mapSection);
  }

  const loadKakaoMap = () => {
    const mapContainer = document.getElementById('kakao-map');
    if (!mapContainer) return;

    // Show Placeholder if API Key is not set
    if (!KAKAO_KEY || KAKAO_KEY === 'YOUR_JAVASCRIPT_KEY_HERE' || KAKAO_KEY === '') {
      mapContainer.innerHTML = `
        <div class="map-placeholder">
          <div class="map-placeholder-icon">🗺️</div>
          <h4 class="map-placeholder-title">카카오맵 API 연동 대기 중</h4>
          <p class="map-placeholder-desc">
            본 페이지는 로컬 및 웹 환경에서 작동하는 실시간 카카오맵 API 코드를 모두 구비하고 있습니다.<br>
            카카오 개발자 콘솔에서 발급받은 <code>자바스크립트 키</code>를 <code>js/app.js</code> 상단의 <code>KAKAO_KEY</code> 변수에 입력하시면 실시간 인터랙티브 지도가 즉시 작동합니다.
          </p>
          <a href="https://developers.kakao.com/" target="_blank" rel="noopener" class="map-placeholder-btn">카카오 개발자 센터 바로가기</a>
        </div>
      `;
      return;
    }

    // Dynamic SDK script loading
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false`;
    script.onload = () => {
      kakao.maps.load(() => {
        initializeKakaoMap(mapContainer);
      });
    };
    script.onerror = () => {
      mapContainer.innerHTML = `
        <div class="map-placeholder">
          <div class="map-placeholder-icon">⚠️</div>
          <h4 class="map-placeholder-title">API 로드 에러</h4>
          <p class="map-placeholder-desc">카카오맵 스크립트를 불러오지 못했습니다. API 키가 유효한지 또는 도메인 허용 설정(Web 플랫폼 등록)이 올바른지 확인해 주세요.</p>
        </div>
      `;
    };
    document.head.appendChild(script);
  };

  const initializeKakaoMap = (container) => {
    // Spot list with real-world coordinates (around Guro Hang-dong and Oryu-dong)
    const mapSpots = [
      {
        num: '01',
        name: '푸른수목원',
        lat: 37.482701,
        lng: 126.822956,
        dur: '⏱ 약 2시간 권장',
        desc: '서울시 최초의 시립 수목원으로 고요한 수변 데크가 펼쳐집니다.'
      },
      {
        num: '02',
        name: '항동푸른도서관',
        lat: 37.482743,
        lng: 126.825221,
        dur: '⏱ 자유롭게 탐방',
        desc: '수목원의 아름다운 조망을 가득 담은 조용하고 아늑한 도서관.'
      },
      {
        num: '03',
        name: 'KB숲교육센터',
        lat: 37.483482,
        lng: 126.824249,
        dur: '⏱ 약 15분 소요',
        desc: '이국적인 유리온실 속 다양한 아열대 허브 식물 쉼터.'
      },
      {
        num: '04',
        name: '항동철길',
        lat: 37.484439,
        lng: 126.824734,
        dur: '⏱ 약 25분 소요',
        desc: '옛 화물열차가 오가던 흔적이 그대로 남은 정취 있는 단선 철도.'
      },
      {
        num: '05',
        name: '오류버들마을',
        lat: 37.492211,
        lng: 126.840612,
        dur: '⏱ 약 2시간 이상',
        desc: '힙한 브런치 카페, 로컬 공방이 가득한 매력 넘치는 골목길.'
      }
    ];

    // Center coordinates
    const centerLat = 37.4871;
    const centerLng = 126.8318;

    const options = {
      center: new kakao.maps.LatLng(centerLat, centerLng),
      level: 5 // map zoom level
    };

    const map = new kakao.maps.Map(container, options);

    // Map Controls
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    const mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    // Marker bounds for auto-fitting
    const bounds = new kakao.maps.LatLngBounds();
    const linePath = [];
    let currentOverlay = null;

    mapSpots.forEach((spot) => {
      const position = new kakao.maps.LatLng(spot.lat, spot.lng);
      linePath.push(position);
      bounds.extend(position);

      const marker = new kakao.maps.Marker({
        map: map,
        position: position,
        title: spot.name
      });

      // Custom HTML overlay content
      const overlayContent = document.createElement('div');
      overlayContent.className = 'map-overlay-card';
      overlayContent.innerHTML = `
        <div class="map-overlay-hdr">
          <span class="map-overlay-title">STEP ${spot.num} ${spot.name}</span>
          <button class="map-overlay-close">✕</button>
        </div>
        <div class="map-overlay-body">
          <p>${spot.desc}</p>
          <span class="map-overlay-dur">${spot.dur}</span>
        </div>
      `;

      // Custom overlay object
      const customOverlay = new kakao.maps.CustomOverlay({
        content: overlayContent,
        position: position,
        yAnchor: 1.15
      });

      // Add close button event inside overlay
      overlayContent.querySelector('.map-overlay-close').addEventListener('click', (e) => {
        e.stopPropagation();
        customOverlay.setMap(null);
        currentOverlay = null;
      });

      // Show overlay on marker click
      kakao.maps.event.addListener(marker, 'click', () => {
        if (currentOverlay) {
          currentOverlay.setMap(null);
        }
        customOverlay.setMap(map);
        currentOverlay = customOverlay;
        map.panTo(position);
      });
    });

    // Close open overlay when clicking map background
    kakao.maps.event.addListener(map, 'click', () => {
      if (currentOverlay) {
        currentOverlay.setMap(null);
        currentOverlay = null;
      }
    });

    // Draw Polyline connecting all 5 spots
    const polyline = new kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 4,
      strokeColor: '#4a7c59',
      strokeOpacity: 0.8,
      strokeStyle: 'dashed'
    });
    polyline.setMap(map);

    // Zoom the map to display all markers nicely
    map.setBounds(bounds);
  };

  loadKakaoMap();

  // ── FEATURE 6: FAQ ACCORDION LOGIC & SCROLL ANIMATION ──
  const faqSection = document.getElementById('visit-faq');
  if (faqSection) {
    const faqObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        faqSection.classList.add('in');
        faqObserver.unobserve(faqSection);
      }
    }, { threshold: 0.15 });
    faqObserver.observe(faqSection);
  }

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    
    if (trigger && panel) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items for a clean accordion effect
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherPanel = otherItem.querySelector('.faq-panel');
            if (otherPanel) otherPanel.style.maxHeight = null;
            const otherTrigger = otherItem.querySelector('.faq-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });
        
        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          panel.style.maxHeight = null;
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          panel.style.maxHeight = panel.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
});
