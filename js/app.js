/* ═══════════════════════════════════════════════════════════
   APP.JS — Full Application Logic
   Pure vanilla JS, zero library dependencies
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── STATE ──────────────────────────────────────────── */
  let currentScreen = 'privacy';
  let missCount = parseInt(localStorage.getItem('missCount') || '0');
  let heroInterval = null;
  let heroActive = 1;

  // Track quick taps for Miss You cuddle egg
  let lastTapTime = 0;
  let quickTapCount = 0;
  let isLoopRunning = false;

  // Global Music Player state
  let globalAudio = null;
  let globalPlaying = false;
  let audioStarted = false;
  let currentTrackIndex = 0;

  /* ─── HELPERS ────────────────────────────────────────── */
  function $(id) { return document.getElementById(id); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function fmtTime(s) { if (isNaN(s)) return '0:00'; return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`; }

  /* ─── FLOATING HEARTS (Home Screen Background) ───────── */
  function initHearts() {
    const container = $('hearts-bg');
    if (!container) return;
    const emojis = ['💖','💛','🌸','⭐','💕','🌼','💗','✨','🎀','💝'];
    for (let i = 0; i < 18; i++) {
      const el = document.createElement('span');
      el.className = 'heart-float';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = `${Math.random() * 100}%`;
      el.style.fontSize = `${Math.random() * 1.2 + 0.8}rem`;
      el.style.animationDuration = `${Math.random() * 8 + 10}s`;
      el.style.animationDelay = `${Math.random() * 10}s`;
      container.appendChild(el);
    }
  }

  /* ─── TIMELINE FLOATING STARS AND HEARTS BACKGROUND ─── */
  function initTimelineBg() {
    const container = $('timeline-ambient-bg');
    if (!container) return;
    container.innerHTML = ''; // Clear existing
    const elements = ['✨', '⭐', '💖', '💛', '💗', '🌸'];
    for (let i = 0; i < 22; i++) {
      const el = document.createElement('span');
      el.className = 'timeline-particle';
      el.textContent = elements[Math.floor(Math.random() * elements.length)];
      el.style.left = `${Math.random() * 100}%`;
      el.style.fontSize = `${Math.random() * 1.5 + 0.8}rem`;
      el.style.animationDuration = `${Math.random() * 10 + 8}s`;
      el.style.animationDelay = `-${Math.random() * 10}s`;
      container.appendChild(el);
    }
  }

  /* ─── LOADING SCREEN ─────────────────────────────────── */
  function hideLoader() {
    const loader = $('loading-screen');
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => { loader.style.display = 'none'; }, 750);
    }, 1400);
  }

  /* ─── SCREEN NAVIGATION ──────────────────────────────── */
  function showScreen(id, fromPrivacy) {
    const screens = document.querySelectorAll('.screen');
    const nav = $('nav');

    screens.forEach(s => {
      s.classList.remove('active');
      s.style.display = '';
    });

    const target = $('screen-' + id);
    if (!target) return;

    target.style.display = id === 'privacy' ? 'flex' : 'block';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.classList.add('active');
        target.scrollTop = 0;
      });
    });

    currentScreen = id;

    // Nav visibility
    if (id === 'privacy') {
      nav.classList.remove('visible');
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
      nav.classList.add('visible');
    }

    // Update nav active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === id);
    });

    // Screen-specific init
    if (id === 'dashboard') onDashboardEnter();
    if (id === 'timeline')  onTimelineEnter();
    if (id === 'evening')   onEveningEnter();
    if (id === 'letters')   onLettersEnter();
  }

  /* ─── NAV BINDINGS ───────────────────────────────────── */
  function initNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        if (target && target !== currentScreen) showScreen(target);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && currentScreen !== 'privacy' && currentScreen !== 'dashboard') {
        showScreen('dashboard');
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
     PRIVACY GATE
  ═══════════════════════════════════════════════════════ */
  function initGate() {
    const form   = $('gate-form');
    const input  = $('gate-input');
    const hint   = $('gate-hint');
    const bloom  = $('gate-bloom');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim().toLowerCase();
      const ans = CONFIG.privacyAnswer.trim().toLowerCase();

      if (val === ans) {
        input.disabled = true;
        document.querySelector('.gate-btn').disabled = true;
        bloom.classList.add('flash');
        setTimeout(() => {
          bloom.classList.remove('flash');
          showScreen('dashboard', true);
        }, 600);
      } else {
        input.classList.add('shake');
        hint.textContent = "Hmm, that's not quite right... try again? 🌙";
        input.addEventListener('animationend', () => { input.classList.remove('shake'); }, { once: true });
        setTimeout(() => { input.value = ''; hint.textContent = ''; input.focus(); }, 500);
      }
    });

    input.focus();
  }

  /* ═══════════════════════════════════════════════════════
     DASHBOARD
  ═══════════════════════════════════════════════════════ */
  function onDashboardEnter() {
    initHeroRotation();
    initMissYouBtn();
    initCassetteEgg();
    initStickerModal();
    initStatsCounter();
  }

  /* Animated Stats Counter */
  let statsInitialized = false;
  function initStatsCounter() {
    if (statsInitialized) return;
    const card = $('our-stats-card');
    if (!card) return;

    // Compute real days & weeks from anniversary date
    const start = new Date(CONFIG.anniversaryDate);
    const now = new Date();
    const realDays = Math.floor((now - start) / 86400000);
    const realWeeks = Math.floor(realDays / 7);

    // Update data-target attributes with real values
    const statNumbers = card.querySelectorAll('.stat-number');
    statNumbers.forEach(el => {
      if (el.closest('.stat-item').querySelector('.stat-label').textContent.includes('days')) {
        el.setAttribute('data-target', realDays);
      }
      if (el.closest('.stat-item').querySelector('.stat-label').textContent.includes('weeks')) {
        el.setAttribute('data-target', realWeeks);
      }
    });

    const animateCounter = (el) => {
      const isInfinity = el.getAttribute('data-is-infinity') === 'true';
      const suffix = el.getAttribute('data-suffix') || '';

      if (isInfinity) {
        el.textContent = '∞';
        return;
      }

      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = Math.min(2000, Math.max(800, target * 3));
      const startTime = performance.now();

      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(easedProgress * target);

        el.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(update);
    };

    const statItems = card.querySelectorAll('.stat-item');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsInitialized) {
            statsInitialized = true;
            statItems.forEach((item, i) => {
              setTimeout(() => {
                item.style.transition = 'opacity .6s var(--ease-smooth), transform .6s var(--ease-smooth)';
                item.classList.add('visible');
                const numEl = item.querySelector('.stat-number');
                if (numEl) animateCounter(numEl);
              }, i * 150);
            });
            observer.disconnect();
          }
        });
      }, { threshold: 0.3 });
      observer.observe(card);
    } else {
      // Fallback: just show them immediately
      statsInitialized = true;
      statItems.forEach(item => {
        item.classList.add('visible');
        const numEl = item.querySelector('.stat-number');
        if (numEl) animateCounter(numEl);
      });
    }
  }

  /* Hero image rotation */
  function initHeroRotation() {
    if (heroInterval) return;
    const img1 = $('hero1');
    const img2 = $('hero2');
    if (!img1 || !img2) return;

    heroInterval = setInterval(() => {
      if (heroActive === 1) {
        img1.classList.remove('active');
        img2.classList.add('active');
        heroActive = 2;
      } else {
        img2.classList.remove('active');
        img1.classList.add('active');
        heroActive = 1;
      }
    }, 7000);
  }

  /* Miss You Button with Cuddle Egg */
  let missCanvas, missCtx, missParticles = [], missRafId;

  function initMissYouBtn() {
    const btn     = $('miss-btn');
    const counter = $('miss-counter');
    const secret  = $('miss-secret');

    if (!btn) return;

    // Setup canvas for heart particles
    missCanvas = $('heart-canvas');
    if (missCanvas) {
      missCanvas.width  = window.innerWidth;
      missCanvas.height = window.innerHeight;
      missCtx = missCanvas.getContext('2d');
      window.addEventListener('resize', () => {
        if (missCanvas) { missCanvas.width = window.innerWidth; missCanvas.height = window.innerHeight; }
      });
    }

    updateMissCounter(counter);

    btn.addEventListener('click', () => {
      const now = Date.now();
      missCount++;
      localStorage.setItem('missCount', missCount);
      updateMissCounter(counter);

      btn.classList.remove('clicked');
      void btn.offsetWidth;
      btn.classList.add('clicked');
      btn.addEventListener('animationend', () => btn.classList.remove('clicked'), { once: true });

      const origText = btn.textContent;
      btn.textContent = 'Me too, always 🫀';
      setTimeout(() => { btn.textContent = origText; }, 1800);

      spawnHearts(btn);

      // Track rapid taps for Cuddle Egg popup modal
      if (now - lastTapTime < 600) {
        quickTapCount++;
      } else {
        quickTapCount = 1;
      }
      lastTapTime = now;

      if (quickTapCount >= 10) {
        quickTapCount = 0; // reset
        const stickerModal = $('sticker-modal');
        if (stickerModal) stickerModal.classList.add('open');
      }

      if (missCount % 10 === 0 && secret) {
        const idx = Math.floor((missCount / 10 - 1) % CONFIG.secretMessages.length);
        const msg = CONFIG.secretMessages[idx].replace('[N]', missCount);
        secret.textContent = msg;
        secret.classList.add('show');
        setTimeout(() => secret.classList.remove('show'), 5000);
      }
    });
  }

  function updateMissCounter(el) {
    if (!el) return;
    if (missCount === 0)      el.textContent = '';
    else if (missCount === 1) el.textContent = "You've missed me once today 🥺";
    else                      el.textContent = `You've missed me ${missCount} times today`;
  }

  function spawnHearts(btn) {
    if (!missCanvas) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    for (let i = 0; i < 6; i++) {
      missParticles.push({
        x: cx + (Math.random() - .5) * 60,
        y: cy,
        vx: (Math.random() - .5) * 4,
        vy: -Math.random() * 5 - 2,
        size: Math.random() * 14 + 8,
        opacity: 1,
        emoji: Math.random() > .4 ? '🤍' : (Math.random() > .5 ? '✨' : '💛'),
        decay: Math.random() * .015 + .018,
        spin: (Math.random() - .5) * .12,
        angle: 0,
      });
    }
    // Dynamically start particle loop if not already running
    animateParticles();
  }

  function animateParticles() {
    if (isLoopRunning) return;
    isLoopRunning = true;
    const loop = () => {
      if (missParticles.length === 0) {
        if (missCtx && missCanvas) {
          missCtx.clearRect(0, 0, missCanvas.width, missCanvas.height);
        }
        isLoopRunning = false;
        return; // STOP loop completely to save battery and CPU!
      }
      if (!missCtx) { missRafId = requestAnimationFrame(loop); return; }
      missCtx.clearRect(0, 0, missCanvas.width, missCanvas.height);
      missParticles = missParticles.filter(p => p.opacity > 0);
      missParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += .08;
        p.opacity -= p.decay; p.angle += p.spin;
        missCtx.save();
        missCtx.globalAlpha = Math.max(0, p.opacity);
        missCtx.font = `${p.size}px serif`;
        missCtx.translate(p.x, p.y);
        missCtx.rotate(p.angle);
        missCtx.fillText(p.emoji, -p.size / 2, p.size / 2);
        missCtx.restore();
      });
      missRafId = requestAnimationFrame(loop);
    };
    loop();
  }

  /* Cassette Easter Egg (Remote-Controls the Global Music Track!) */
  function initCassetteEgg() {
    const trigger = $('cassette-trigger');
    const modal   = $('cassette-modal');
    const closeBtn= $('cassette-close');
    const playBtn = $('cassette-play');
    const reelL   = $('reel-l');
    const reelR   = $('reel-r');

    if (!trigger || !modal) return;

    trigger.addEventListener('click', () => modal.classList.add('open'));

    const closeModal = () => {
      modal.classList.remove('open');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

    // Sync play status with global audio
    const updateCassetteIcon = () => {
      if (playBtn) playBtn.textContent = globalPlaying ? '⏸' : '▶';
      [reelL, reelR].forEach(r => { if (r) r.classList.toggle('spinning', globalPlaying); });
    };

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        const gpPlayBtn = $('gp-play-pause');
        if (gpPlayBtn) gpPlayBtn.click(); // Trigger global play button to keep states synced!
        setTimeout(updateCassetteIcon, 50);
      });
    }

    // Re-sync icon when opening cassette trigger
    trigger.addEventListener('click', updateCassetteIcon);
  }

  /* Cuddle Sticker Egg Modal */
  function initStickerModal() {
    const modal = $('sticker-modal');
    const closeBtn = $('sticker-close');
    if (!modal) return;
    const closeModal = () => modal.classList.remove('open');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  }

  /* ─── GLOBAL STICKY BOTTOM MUSIC PLAYER ──────────────── */
  function initGlobalMusic() {
    globalAudio = $('global-audio');
    const playBtn = $('gp-play-pause');
    const prevBtn = $('gp-prev');
    const nextBtn = $('gp-next');
    const toggleBtn = $('gp-toggle-drawer');
    const closeDrawerBtn = $('gp-drawer-close');
    const drawer = $('gp-drawer');
    const listContainer = $('gp-drawer-list');
    const infoClick = $('gp-info-click');
    const eqBars = document.querySelectorAll('.eq-bar');
    const progressTrack = $('gp-progress-track');
    const progressFill = $('gp-progress-fill');
    const timeLabel = $('gp-time');

    if (!globalAudio || !playBtn) return;

    const updateEQ = (active) => {
      eqBars.forEach(b => b.classList.toggle('active', active));
      const cassettePlay = $('cassette-play');
      if (cassettePlay) {
        cassettePlay.textContent = active ? '⏸' : '▶';
        const reelL = $('reel-l');
        const reelR = $('reel-r');
        [reelL, reelR].forEach(r => { if (r) r.classList.toggle('spinning', active); });
      }
    };

    const renderPlaylist = () => {
      if (!listContainer) return;
      listContainer.innerHTML = '';
      PLAYLIST.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = `gp-track-item${index === currentTrackIndex ? ' active' : ''}`;
        item.setAttribute('role', 'listitem');
        item.innerHTML = `
          <div class="gp-track-info">
            <span class="gp-track-num">${pad(index + 1)}</span>
            <span class="gp-track-title">${track.title}</span>
            <span class="gp-track-tag">${track.category}</span>
          </div>
          <div class="gp-track-playing-icon" aria-hidden="true">💖</div>
        `;
        item.addEventListener('click', () => {
          playTrack(index);
        });
        listContainer.appendChild(item);
      });
    };

    const playTrack = (index, forcePlay = true) => {
      if (index < 0 || index >= PLAYLIST.length) return;
      currentTrackIndex = index;
      const track = PLAYLIST[index];

      // Pause evening walk audio if it is playing!
      if (audioEl && !audioEl.paused) {
        audioEl.pause();
        isPlaying = false;
        const eveningPlayBtn = $('audio-play');
        if (eveningPlayBtn) {
          const icon = $('audio-icon');
          if (icon) icon.textContent = '▶';
          const wbars = document.querySelectorAll('.wbar');
          wbars.forEach(b => b.classList.remove('active'));
          const playerEl = $('audio-player');
          if (playerEl) playerEl.classList.remove('is-playing');
        }
      }

      globalAudio.src = track.file + '?v=' + Date.now();
      globalAudio.load();

      // Update current playing text
      const titleEl = $('gp-current-title');
      const descEl = $('gp-current-desc');
      if (titleEl) titleEl.textContent = track.title;
      if (descEl) descEl.textContent = `playing ${track.category} 🌸`;

      // Update Cassette modal details
      const cassetteLabel = $('cassette-label-text');
      const cassetteTrack = $('cassette-track-name');
      if (cassetteLabel) cassetteLabel.textContent = track.title;
      if (cassetteTrack) cassetteTrack.textContent = track.title;

      // Update active highlight in drawer
      document.querySelectorAll('.gp-track-item').forEach((item, idx) => {
        item.classList.toggle('active', idx === currentTrackIndex);
      });

      if (forcePlay) {
        globalAudio.play().then(() => {
          globalPlaying = true;
          playBtn.textContent = '⏸';
          updateEQ(true);
        }).catch(() => {
          globalPlaying = false;
          playBtn.textContent = '▶';
          updateEQ(false);
        });
      } else {
        globalPlaying = false;
        playBtn.textContent = '▶';
        updateEQ(false);
      }
    };

    const playNext = () => {
      let nextIndex = currentTrackIndex + 1;
      if (nextIndex >= PLAYLIST.length) nextIndex = 0;
      playTrack(nextIndex);
    };

    const playPrev = () => {
      let prevIndex = currentTrackIndex - 1;
      if (prevIndex < 0) prevIndex = PLAYLIST.length - 1;
      playTrack(prevIndex);
    };

    const togglePlayback = () => {
      if (globalPlaying) {
        globalAudio.pause();
        globalPlaying = false;
        playBtn.textContent = '▶';
        updateEQ(false);
      } else {
        // Pause evening walk audio if it's playing!
        if (audioEl && !audioEl.paused) {
          audioEl.pause();
          isPlaying = false;
          const eveningPlayBtn = $('audio-play');
          if (eveningPlayBtn) {
            const icon = $('audio-icon');
            if (icon) icon.textContent = '▶';
            const wbars = document.querySelectorAll('.wbar');
            wbars.forEach(b => b.classList.remove('active'));
            const playerEl = $('audio-player');
            if (playerEl) playerEl.classList.remove('is-playing');
          }
        }

        globalAudio.play().then(() => {
          globalPlaying = true;
          playBtn.textContent = '⏸';
          updateEQ(true);
        }).catch(() => {});
      }
    };

    playBtn.addEventListener('click', togglePlayback);
    if (prevBtn) prevBtn.addEventListener('click', playPrev);
    if (nextBtn) nextBtn.addEventListener('click', playNext);

    // Toggle playlist drawer
    const toggleDrawer = (e) => {
      if (e) e.stopPropagation();
      if (drawer) {
        drawer.classList.toggle('open');
        if (drawer.classList.contains('open')) {
          const activeItem = drawer.querySelector('.gp-track-item.active');
          if (activeItem) {
            activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
      }
    };

    if (toggleBtn) toggleBtn.addEventListener('click', toggleDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', (e) => { e.stopPropagation(); drawer && drawer.classList.remove('open'); });
    if (infoClick) infoClick.addEventListener('click', toggleDrawer);

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (drawer && drawer.classList.contains('open')) {
        const insideDrawer = drawer.contains(e.target);
        const insideToggle = toggleBtn && toggleBtn.contains(e.target);
        const insideInfo = infoClick && infoClick.contains(e.target);
        if (!insideDrawer && !insideToggle && !insideInfo) {
          drawer.classList.remove('open');
        }
      }
    });

    // Fully interactive scrubbing (click, drag, and touch!)
    if (progressTrack) {
      let isDragging = false;

      const scrub = (clientX) => {
        const rect = progressTrack.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        if (globalAudio.duration) {
          globalAudio.currentTime = ratio * globalAudio.duration;
        }
      };

      // Mouse events
      progressTrack.addEventListener('mousedown', (e) => {
        isDragging = true;
        scrub(e.clientX);
      });

      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          scrub(e.clientX);
        }
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });

      // Touch events (for mobile!)
      progressTrack.addEventListener('touchstart', (e) => {
        isDragging = true;
        scrub(e.touches[0].clientX);
      }, { passive: true });

      document.addEventListener('touchmove', (e) => {
        if (isDragging) {
          scrub(e.touches[0].clientX);
        }
      }, { passive: true });

      document.addEventListener('touchend', () => {
        isDragging = false;
      });
    }

    // Time & progress bar updates
    globalAudio.addEventListener('timeupdate', () => {
      if (!globalAudio.duration) return;
      const pct = (globalAudio.currentTime / globalAudio.duration) * 100;
      if (progressFill) progressFill.style.width = pct + '%';
      if (timeLabel) timeLabel.textContent = fmtTime(globalAudio.currentTime);
    });

    // Sequential Autoplay: advance to next track when song ends
    globalAudio.addEventListener('ended', playNext);

    // Auto-start play on first user interaction to bypass autoplay restrictions!
    const startAudioOnInteraction = () => {
      if (audioStarted) return;
      audioStarted = true;
      globalAudio.play().then(() => {
        globalPlaying = true;
        playBtn.textContent = '⏸';
        updateEQ(true);
      }).catch(() => {
        audioStarted = false; // retry on next interaction if blocked
      });
    };

    document.addEventListener('click', startAudioOnInteraction, { once: true });
    document.addEventListener('touchstart', startAudioOnInteraction, { once: true });
    document.addEventListener('keydown', startAudioOnInteraction, { once: true });

    // Also link submit of gate-form to trigger audio immediately!
    const gateForm = $('gate-form');
    if (gateForm) {
      gateForm.addEventListener('submit', startAudioOnInteraction);
    }

    // Initialize playlist track (without force playing)
    playTrack(0, false);
    renderPlaylist();
  }

  /* ═══════════════════════════════════════════════════════
     TIMELINE
  ═══════════════════════════════════════════════════════ */
  let timelineBuilt = false;

  function onTimelineEnter() {
    initTimelineBg();
    if (!timelineBuilt) {
      buildTimeline();
      buildConstellation();
      timelineBuilt = true;
    }
  }

  function buildTimeline() {
    const container = $('timeline-entries');
    if (!container) return;

    let mediaIndex = 0;

    TIMELINE_DATA.forEach(item => {
      if (item.chapterLabel) {
        const ch = document.createElement('div');
        ch.className = 'chapter-label';
        ch.innerHTML = `<span>${item.chapterLabel}</span>`;
        container.appendChild(ch);
      }

      if (item.isTextOnly || item.isAnniversary) {
        const tc = document.createElement('div');
        tc.className = `text-card${item.isAnniversary ? ' anniversary-card' : ''}`;
        tc.setAttribute('role', 'listitem');
        
        let polaroidHTML = '';
        if (item.isAnniversary) {
          polaroidHTML = `
            <div class="card-diagonal-polaroid" aria-label="Our memory polaroid" style="cursor: pointer;">
              <img src="./assets/diagonal_photo.png" alt="Starry sky or special memory" />
            </div>
          `;
        }

        tc.innerHTML = `
          ${polaroidHTML}
          <div class="text-card-icon">${item.specialIcon || '●'}</div>
          <div class="text-card-date">${item.date}</div>
          <h3 class="text-card-title">${item.title}${item.isLast ? ' 🤍' : ''}</h3>
          <p class="text-card-caption">${item.caption}</p>
        `;
        container.appendChild(tc);

        if (item.isAnniversary) {
          const diagPolaroid = tc.querySelector('.card-diagonal-polaroid');
          if (diagPolaroid) {
            diagPolaroid.addEventListener('click', () => {
              openLightbox({
                photo: "./assets/diagonal_photo.png",
                polaroidCaption: "I LOB U ✦ 28.06.24"
              });
            });
          }
        }
        return;
      }

      const isLeft = mediaIndex % 2 === 0;
      mediaIndex++;

      const card = document.createElement('div');
      card.className = `tl-card ${isLeft ? 'left' : 'right'}${item.isFuture ? ' future-card' : ''}`;
      card.setAttribute('role', 'listitem');

      const photoDiv = document.createElement('div');
      photoDiv.className = 'card-photo';

      const polaroid = document.createElement('div');
      polaroid.className = 'polaroid-wrap';
      polaroid.style.position = 'relative';

      if (item.isVideo && item.video) {
        const vid = document.createElement('video');
        vid.className = 'polaroid-img';
        vid.src = item.video;
        vid.setAttribute('muted', 'true');
        vid.setAttribute('loop', 'true');
        vid.setAttribute('playsinline', 'true');
        vid.setAttribute('autoplay', 'true');
        vid.muted = true; vid.loop = true; vid.playsInline = true; vid.autoplay = true;
        vid.preload = 'auto';
        polaroid.appendChild(vid);

        const badge = document.createElement('div');
        badge.className = 'video-badge'; badge.textContent = '▶';
        polaroid.appendChild(badge);

      } else if (item.photo) {
        const img = document.createElement('img');
        img.className = 'polaroid-img';
        if (item.is5x7) img.classList.add('polaroid-5x7');
        img.src = item.photo; img.alt = item.title; img.loading = 'lazy';
        polaroid.appendChild(img);
      } else {
        const ph = document.createElement('div');
        ph.className = 'polaroid-placeholder';
        ph.textContent = item.isFuture ? '🌏' : '📷';
        polaroid.appendChild(ph);
      }

      polaroid.addEventListener('click', () => {
        openLightbox(item);
      });

      const cap = document.createElement('div');
      cap.className = 'polaroid-cap';
      cap.textContent = item.polaroidCaption || '';
      polaroid.appendChild(cap);
      photoDiv.appendChild(polaroid);

      const centerDiv = document.createElement('div');
      centerDiv.className = 'card-center';
      const dot = document.createElement('div');
      dot.className = 'center-dot';
      centerDiv.appendChild(dot);

      const textDiv = document.createElement('div');
      textDiv.className = 'card-text';

      let titleHTML = item.title;
      if (item.isLast) titleHTML += ' 🤍';
      if (item.isFuture) titleHTML += ' <span class="future-dot">●</span>';

      textDiv.innerHTML = `
        <div class="card-date">${item.date}</div>
        <h3 class="card-title">${titleHTML}</h3>
        <p class="card-caption">${item.caption}</p>
      `;

      card.appendChild(photoDiv);
      card.appendChild(centerDiv);
      card.appendChild(textDiv);
      container.appendChild(card);

      if ('IntersectionObserver' in window) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'opacity .7s ease, transform .7s ease';

        const obs = new IntersectionObserver((entries) => {
          entries.forEach(en => {
            if (en.isIntersecting) {
              en.target.style.opacity = '1';
              en.target.style.transform = 'none';
              obs.unobserve(en.target);
            }
          });
        }, { threshold: .15 });
        obs.observe(card);
      }
    });
  }

  function buildConstellation() {
    const canvas = $('constellation-canvas');
    if (!canvas) return;

    const start = new Date(CONFIG.anniversaryDate);
    const now   = new Date();
    const totalWeeks = Math.floor((now - start) / 604800000);
    if (totalWeeks <= 0) return;

    const W = Math.min(window.innerWidth - 64, 620);
    const H = 180;
    canvas.width = W; canvas.height = H;

    const ctx = canvas.getContext('2d');
    const stars = [];
    const cols  = Math.ceil(Math.sqrt(totalWeeks * (W / H)));

    for (let i = 0; i < totalWeeks; i++) {
      const progress = i / totalWeeks;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const totalRows = Math.ceil(totalWeeks / cols);
      const x = 20 + col * ((W - 40) / Math.max(cols - 1, 1));
      const y = 28 + (row / Math.max(totalRows - 1, 1)) * (H - 56) +
                Math.sin(progress * Math.PI * 3.5) * 18 + (Math.random() - .5) * 8;

      stars.push({
        x: Math.max(8, Math.min(W - 8, x)),
        y: Math.max(8, Math.min(H - 8, y)),
        r: Math.random() * 1.4 + 0.6,
        opacity: Math.random() * .4 + .55,
        week: i + 1,
        isPulse: i >= totalWeeks - 6,
        isNewest: i === totalWeeks - 1,
      });
    }

    const caption = $('constellation-caption');
    if (caption) caption.textContent = `${totalWeeks} weeks of us — each star is one ✨`;

    let hoveredStar = null;
    let pulsePhase  = 0;
    let raf;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0d0a06'; ctx.fillRect(0, 0, W, H);

      ctx.beginPath();
      stars.forEach((s, i) => { if (i === 0) ctx.moveTo(s.x, s.y); else ctx.lineTo(s.x, s.y); });
      ctx.strokeStyle = 'rgba(200,169,126,.1)'; ctx.lineWidth = .7; ctx.stroke();

      pulsePhase += .04;

      stars.forEach(s => {
        const isHov = hoveredStar === s;
        let r = s.r, a = s.opacity;
        if (s.isPulse) { r = s.r + Math.sin(pulsePhase) * .9; a = s.opacity * (.65 + Math.sin(pulsePhase) * .35); }
        if (isHov) { r = s.r * 2.8; a = 1; }

        if (s.isPulse) {
          const grd = ctx.createRadialGradient(s.x, s.y, r, s.x, s.y, r * 4);
          grd.addColorStop(0, 'rgba(212,168,67,.2)'); grd.addColorStop(1, 'transparent');
          ctx.beginPath(); ctx.arc(s.x, s.y, r * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd; ctx.fill();
        }

        ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isHov ? '#fdf6e3' : s.isPulse ? `rgba(212,168,67,${a})` : `rgba(245,236,215,${a})`;
        ctx.fill();
      });

      if (hoveredStar) {
        const s = hoveredStar, label = `Week ${s.week} together ✨`;
        ctx.font = '11px Nunito, sans-serif';
        const tw = ctx.measureText(label).width;
        const tx = Math.min(Math.max(s.x - tw / 2, 4), W - tw - 4);
        const ty = s.y > H / 2 ? s.y - 16 : s.y + 20;
        ctx.fillStyle = 'rgba(13,10,6,.9)'; ctx.fillRect(tx - 5, ty - 14, tw + 10, 20);
        ctx.fillStyle = 'rgba(200,169,126,.95)'; ctx.fillText(label, tx, ty);
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (W / rect.width);
      const my = (e.clientY - rect.top)  * (H / rect.height);
      hoveredStar = stars.find(s => Math.hypot(s.x - mx, s.y - my) < 10) || null;
      canvas.style.cursor = hoveredStar ? 'pointer' : 'crosshair';
    });
    canvas.addEventListener('mouseleave', () => { hoveredStar = null; });
  }

  /* ═══════════════════════════════════════════════════════
     EVENING WALK
  ═══════════════════════════════════════════════════════ */
  let eveningBuilt = false;
  let audioPlayer, audioEl, isPlaying = false;

  function onEveningEnter() {
    if (!eveningBuilt) {
      buildPolaroidGallery();
      initDustMotes();
      eveningBuilt = true;
    }
    initAudioPlayer();
  }

  function initDustMotes() {
    const wrap = $('dust-wrap');
    if (!wrap) return;
    for (let i = 0; i < 20; i++) {
      const m = document.createElement('div');
      m.className = 'dust-mote';
      m.style.left = `${Math.random() * 100}%`;
      m.style.setProperty('--drift-x', `${(Math.random() - .5) * 60}px`);
      m.style.animationDuration = `${8 + Math.random() * 12}s`;
      m.style.animationDelay = `-${Math.random() * 14}s`;
      m.style.opacity = String(Math.random() * .4 + .1);
      wrap.appendChild(m);
    }
  }

  function initAudioPlayer() {
    audioEl = $('ambient-audio');
    const playBtn      = $('audio-play');
    const icon         = $('audio-icon');
    const loopBtn      = $('audio-loop');
    const fill         = $('audio-progress-fill');
    const track        = $('audio-progress-track');
    const cur          = $('audio-cur');
    const dur          = $('audio-dur');
    const wbars        = document.querySelectorAll('.wbar');

    if (!audioEl || !playBtn) return;

    const heights = [30, 60, 90, 50, 75, 40, 85, 55, 70, 35, 65, 80, 45];
    wbars.forEach((b, i) => {
      b.style.height = `${heights[i % heights.length]}%`;
      b.style.setProperty('--wave-dur', `${.5 + (i % 4) * .15}s`);
      b.style.setProperty('--wave-delay', `${(i % 5) * .1}s`);
    });

    const updateUI = () => {
      icon.textContent = isPlaying ? '⏸' : '▶';
      wbars.forEach(b => b.classList.toggle('active', isPlaying));
      if ($('audio-player')) $('audio-player').classList.toggle('is-playing', isPlaying);
    };

    playBtn.addEventListener('click', () => {
      if (audioEl.paused) {
        // Pause global audio first to prevent overlap!
        if (globalAudio && globalPlaying) {
          const gpPlayBtn = $('gp-play-pause');
          if (gpPlayBtn) gpPlayBtn.click();
        }
        audioEl.play().then(() => { isPlaying = true; updateUI(); }).catch(() => {});
      } else {
        audioEl.pause(); isPlaying = false; updateUI();
      }
    });

    if (loopBtn) {
      audioEl.loop = true; loopBtn.classList.add('active');
      loopBtn.addEventListener('click', () => {
        audioEl.loop = !audioEl.loop;
        loopBtn.classList.toggle('active', audioEl.loop);
      });
    }

    audioEl.addEventListener('timeupdate', () => {
      if (!audioEl.duration) return;
      const pct = (audioEl.currentTime / audioEl.duration) * 100;
      if (fill) fill.style.width = pct + '%';
      if (cur) cur.textContent = fmtTime(audioEl.currentTime);
    });

    audioEl.addEventListener('loadedmetadata', () => { if (dur) dur.textContent = fmtTime(audioEl.duration); });

    if (track) {
      track.addEventListener('click', (e) => {
        const rect = track.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        if (audioEl.duration) audioEl.currentTime = ratio * audioEl.duration;
      });
    }

    document.addEventListener('keydown', (e) => {
      if (currentScreen !== 'evening' && !audioEl.paused) { audioEl.pause(); isPlaying = false; updateUI(); }
    });
  }

  function buildPolaroidGallery() {
    const grid = $('polaroid-grid');
    if (!grid) return;

    const tilts = [-3, 2, -1.5, 3, -2, 2.5];

    EVENING_PHOTOS.forEach((photo, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'evening-polaroid';
      wrap.style.setProperty('--tilt', `${tilts[i % tilts.length]}deg`);

      let imgEl;
      if (photo.src) {
        imgEl = document.createElement('img');
        imgEl.className = 'evening-polaroid-img';
        imgEl.src = photo.src; imgEl.alt = photo.caption; imgEl.loading = 'lazy';
      } else {
        imgEl = document.createElement('div');
        imgEl.className = 'evening-polaroid-placeholder';
        imgEl.textContent = '📷';
      }

      const cap = document.createElement('div');
      cap.className = 'evening-polaroid-cap';
      cap.textContent = photo.caption;

      wrap.appendChild(imgEl);
      wrap.appendChild(cap);
      grid.appendChild(wrap);

      wrap.addEventListener('click', () => openLightbox(photo));
    });
  }

  function openLightbox(item) {
    const lb     = $('lightbox');
    const lbImg  = $('lb-img');
    const lbVid  = $('lb-video');
    const lbCap  = $('lb-caption');
    const lbClose= $('lb-close');

    if (!lb) return;

    // Pause global music player if we are playing a video with sound!
    let wasMusicPlaying = false;
    if (item.video && globalPlaying) {
      wasMusicPlaying = true;
      globalAudio.pause();
      globalPlaying = false;
      const gpPlayBtn = $('gp-play-pause');
      if (gpPlayBtn) gpPlayBtn.textContent = '▶';
      const eqBars = document.querySelectorAll('.eq-bar');
      eqBars.forEach(b => b.classList.remove('active'));
    }

    if (item.video) {
      if (lbImg) lbImg.style.display = 'none';
      if (lbVid) {
        lbVid.src = item.video;
        lbVid.style.display = 'block';
        lbVid.play().catch(() => {});
      }
    } else {
      if (lbVid) {
        lbVid.pause();
        lbVid.src = '';
        lbVid.style.display = 'none';
      }
      if (lbImg) {
        lbImg.src = item.photo || item.src;
        lbImg.style.display = 'block';
      }
    }

    if (lbCap) lbCap.textContent = item.polaroidCaption || item.caption || '';

    lb.classList.add('open');

    const close = () => {
      lb.classList.remove('open');
      if (lbVid) {
        lbVid.pause();
        lbVid.src = '';
      }
      // Resume global music player if it was playing!
      if (wasMusicPlaying) {
        globalAudio.play().then(() => {
          globalPlaying = true;
          const gpPlayBtn = $('gp-play-pause');
          if (gpPlayBtn) gpPlayBtn.textContent = '⏸';
          const eqBars = document.querySelectorAll('.eq-bar');
          eqBars.forEach(b => b.classList.add('active'));
        }).catch(() => {});
      }
    };

    if (lbClose) lbClose.addEventListener('click', close, { once: true });
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target === lbClose) {
        close();
      }
    });

    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', esc);
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
     OPEN WHEN LETTERS
  ═══════════════════════════════════════════════════════ */
  let lettersBuilt = false;

  function onLettersEnter() {
    if (!lettersBuilt) {
      buildLetterGrid();
      lettersBuilt = true;
    }
  }

  function buildLetterGrid() {
    const grid = $('envelope-grid');
    if (!grid) return;

    OPEN_WHEN_LETTERS.forEach((letter, i) => {
      const card = document.createElement('div');
      card.className = `envelope-card${letter.isSpecial ? ' special' : ''}`;
      card.style.setProperty('--card-accent', letter.accentColor || 'var(--pink)');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${letter.label} ${letter.sublabel}`);

      card.innerHTML = `
        <div class="envelope-flap"></div>
        <span class="wax-seal">${letter.seal}</span>
        <div class="env-label">${letter.label}</div>
        <div class="env-sublabel">${letter.sublabel}</div>
        <div class="env-cta">click to open ↗</div>
      `;

      card.addEventListener('click', () => openLetter(letter));
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLetter(letter); } });
      grid.appendChild(card);
    });

    const modal    = $('letter-modal');
    const closeBtn = $('letter-close');
    if (closeBtn) closeBtn.addEventListener('click', () => modal && modal.classList.remove('open'));
    if (modal) {
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) modal.classList.remove('open'); });
    }
  }

  function openLetter(letterData) {
    const modal    = $('letter-modal');
    const eyebrow  = $('letter-eyebrow');
    const title    = $('letter-title');
    const body     = $('letter-body');
    const sig      = $('letter-sig');
    const photoWrap= $('letter-photo-wrap');

    if (!modal) return;
    const l = letterData.letter;

    if (eyebrow) eyebrow.textContent  = l.eyebrow || '';
    if (title)   title.textContent    = l.title   || '';
    if (body)    body.innerHTML       = l.body     || '';
    if (sig)     sig.textContent      = l.signature|| '';

    if (photoWrap) {
      if (l.photo) {
        photoWrap.style.display = 'block';
        const img = photoWrap.querySelector('img');
        const cap = photoWrap.querySelector('.letter-photo-cap');
        if (img) { img.src = l.photo; img.alt = l.title; }
        if (cap && l.photoCaption) cap.textContent = l.photoCaption;
      } else { photoWrap.style.display = 'none'; }
    }

    const lc = modal.querySelector('.letter-card');
    if (lc) lc.scrollTop = 0;

    modal.classList.add('open');
  }

  /* ═══════════════════════════════════════════════════════
     BOOT
  ═══════════════════════════════════════════════════════ */
  function init() {
    initHearts();
    initNav();
    initGate();
    initGlobalMusic();
    hideLoader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
