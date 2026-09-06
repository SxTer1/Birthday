/* ============================================================
   PART 1: CONSTANTS, STATE, NAVIGATION, PROGRESS BAR
   ============================================================ */

const SCREENS = [
  'screen-intro',
  'screen-timer',
  'screen-carousel',
  'screen-quiz',
  'screen-fake-end',
  'screen-final'
];

const PROGRESS_STEPS = [0, 20, 40, 60, 80, 100];

const state = {
  currentScreen: 0,
  audioUnlocked: false,
  carouselIndex: 0,
  quizIndex: 0,
  timerInterval: null,
};

/* ---------- navigation ---------- */

function showScreen(index, opts = {}) {
  const prev = document.querySelector('.screen.active');
  if (prev) prev.classList.remove('active');

  const next = document.getElementById(SCREENS[index]);
  if (!next) return;

  state.currentScreen = index;
  next.classList.add('active');

  updateProgress(index);

  if (index > 0) {
    document.getElementById('progress-bar').classList.remove('hidden');
  }
}

function nextScreen() {
  const idx = state.currentScreen + 1;
  if (idx < SCREENS.length) showScreen(idx);
}

/* ---------- progress bar ---------- */

function updateProgress(screenIndex) {
  const pct = PROGRESS_STEPS[screenIndex] ?? 0;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-heart').style.left  = pct + '%';
}

function collapseProgress() {
  const bar = document.getElementById('progress-bar');
  bar.style.transition = 'opacity 0.8s';
  bar.style.opacity = '0';
  setTimeout(() => {
    bar.style.opacity = '';
    bar.style.transition = '';
    bar.classList.add('hidden');
  }, 900);
}

/* ============================================================
   PART 2: AUDIO + FLOATING HEARTS + INTRO
   ============================================================ */

const bgMusic = document.getElementById('bg-music');

function unlockAudio() {
  if (state.audioUnlocked) return;
  state.audioUnlocked = true;
  bgMusic.volume = 0;
  bgMusic.play().then(() => fadeInMusic(0.28)).catch(() => {});
}

function fadeInMusic(target, dur = 2000) {
  const step = 50;
  const inc = (target - bgMusic.volume) / (dur / step);
  const iv = setInterval(() => {
    bgMusic.volume = Math.min(target, Math.max(0, bgMusic.volume + inc));
    if (Math.abs(bgMusic.volume - target) < 0.005) {
      bgMusic.volume = target;
      clearInterval(iv);
    }
  }, step);
}

function fadeOutMusic(dur = 2000) {
  const step = 50;
  const dec = bgMusic.volume / (dur / step);
  const iv = setInterval(() => {
    bgMusic.volume = Math.max(0, bgMusic.volume - dec);
    if (bgMusic.volume <= 0.001) {
      bgMusic.pause();
      clearInterval(iv);
    }
  }, step);
}

function restartMusic() {
  bgMusic.currentTime = 0;
  bgMusic.volume = 0;
  bgMusic.play().then(() => fadeInMusic(0.35, 3000)).catch(() => {});
}

/* ---------- floating hearts ---------- */

function spawnFloatingHearts(containerId, count = 12) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const emojis = ['❤️', '🩷', '💕', '💖', '💗', '🌸'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'fh';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.bottom = '-30px';
    el.style.fontSize = (14 + Math.random() * 18) + 'px';
    const dur = 6 + Math.random() * 8;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = (Math.random() * dur) + 's';
    container.appendChild(el);
  }
}

/* ---------- intro ---------- */

function initIntro() {
  spawnFloatingHearts('intro-hearts', 14);

  document.getElementById('btn-start').addEventListener('click', () => {
    unlockAudio();
    showScreen(1);
    initTimer();
  });
}

/* ============================================================
   PART 3: TIMER
   ============================================================ */

// ← Edit this date to your relationship start date
const RELATIONSHIP_START = new Date('2025-10-11T00:00:00');


function getTimeDiff(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  let hours = to.getHours() - from.getHours();
  let minutes = to.getMinutes() - from.getMinutes();
  let seconds = to.getSeconds() - from.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0)   { hours += 24; days--; }
  if (days < 0) {
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) { months += 12; years--; }
  return { years, months, days, hours, minutes, seconds };
}

function updateTimer() {
  const now = new Date();
  const d = getTimeDiff(RELATIONSHIP_START, now);
  document.getElementById('t-years').textContent   = d.years;
  document.getElementById('t-months').textContent  = d.months;
  document.getElementById('t-days').textContent    = d.days;
  document.getElementById('t-hours').textContent   = d.hours;
  document.getElementById('t-minutes').textContent = String(d.minutes).padStart(2, '0');
  document.getElementById('t-seconds').textContent = String(d.seconds).padStart(2, '0');
}

function initTimer() {
  updateTimer();
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(updateTimer, 1000);

  document.getElementById('btn-to-carousel').addEventListener('click', () => {
    showScreen(2);
    initCarousel();
  });
}

/* ============================================================
   PART 4: CAROUSEL
   ============================================================ */

// ← Добавляй/меняй фото здесь (просто путь к файлу в assets)
const PHOTOS = [
  { src: 'assets/0DF1334F-CCCB-419E-A5D9-E26084C56579.jpeg' },
  { src: 'assets/3F7F84D1-5BBC-4D6C-BA51-3CB3D986ABC0.jpeg' },
  { src: 'assets/418C10AE-8BCC-4198-9747-126BC90740FA.jpeg' },
  { src: 'assets/C4CF95A8-938F-4AC7-9D56-A1FB2BD20BAF.jpeg' },
  { src: 'assets/C564D816-94CC-4C57-9254-C7F09D5D8407.jpeg' },
  { src: 'assets/D434B3E0-F6EE-4695-B2A9-7A67F8A097C6.jpeg' },
  { src: 'assets/E873BC3D-F6FA-4D0F-9B07-3EA825324188.jpeg' },
  { src: 'assets/IMG_2282.jpeg' },
  { src: 'assets/IMG_3178.jpeg' },
  { src: 'assets/IMG_3346.jpeg' },
];

let carouselInitDone = false;
let isDragging = false;
let dragStartX = 0;
let dragCurrentX = 0;
let rawCarouselPos = 1;

function initCarousel() {
  if (carouselInitDone) return;
  carouselInitDone = true;

  const track = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('carousel-dots');
  const total = PHOTOS.length;

  // Build: [clone-last, ...real, clone-first]
  const items = [PHOTOS[total - 1], ...PHOTOS, PHOTOS[0]];
  items.forEach((p, i) => {
    const realIdx = ((i - 1 + total) % total);
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.dataset.realIndex = realIdx;

    if (p.src) {
      const img = document.createElement('img');
      img.src = p.src;
      img.alt = '';
      img.loading = 'lazy';
      slide.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'carousel-slide-placeholder';
      slide.appendChild(ph);
    }

    slide.addEventListener('click', () => openFullscreen(realIdx));
    track.appendChild(slide);
  });

  // Dots
  PHOTOS.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goToSlide(i));
    dotsEl.appendChild(d);
  });

  rawCarouselPos = 1;
  setCarouselPosition(1, false);
  updateCarouselUI();
  attachCarouselEvents();

  document.getElementById('btn-to-quiz').addEventListener('click', () => {
    showScreen(3);
    initQuiz();
  });
  document.getElementById('carousel-prev').addEventListener('click', () => carouselStep(-1));
  document.getElementById('carousel-next').addEventListener('click', () => carouselStep(1));
}

function getSlideWidth() {
  const slide = document.querySelector('.carousel-slide');
  return slide ? slide.offsetWidth + 16 : 260;
}

function setCarouselPosition(pos, animate = true) {
  const track = document.getElementById('carousel-track');
  track.style.transition = animate ? 'transform 0.35s cubic-bezier(.25,.46,.45,.94)' : 'none';
  const sw = getSlideWidth();
  const offset = -(pos * sw) + (window.innerWidth - sw) / 2;
  track.style.transform = `translateX(${offset}px)`;
}

function goToSlide(realIdx) {
  const total = PHOTOS.length;
  state.carouselIndex = realIdx;
  rawCarouselPos = realIdx + 1;
  setCarouselPosition(rawCarouselPos);
  updateCarouselUI();
}

function carouselStep(dir) {
  const total = PHOTOS.length;
  rawCarouselPos += dir;
  state.carouselIndex = ((rawCarouselPos - 1) + total) % total;
  setCarouselPosition(rawCarouselPos);
  updateCarouselUI();

  // Silent jump for infinite loop after animation
  setTimeout(() => {
    if (rawCarouselPos <= 0) {
      rawCarouselPos = total;
      setCarouselPosition(rawCarouselPos, false);
    } else if (rawCarouselPos >= total + 1) {
      rawCarouselPos = 1;
      setCarouselPosition(rawCarouselPos, false);
    }
  }, 380);
}

function updateCarouselUI() {
  const slides = document.querySelectorAll('.carousel-slide');
  slides.forEach((s, i) => {
    s.classList.toggle('center-slide', i === rawCarouselPos);
  });
  const dots = document.querySelectorAll('.carousel-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === state.carouselIndex));
}

function attachCarouselEvents() {
  const track = document.getElementById('carousel-track');
  let startX = 0;

  track.addEventListener('touchstart', e => { isDragging = true; startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) carouselStep(diff > 0 ? 1 : -1);
  });
  track.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX; });
  track.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 40) carouselStep(diff > 0 ? 1 : -1);
  });
  track.addEventListener('mouseleave', () => { isDragging = false; });
}

/* ============================================================
   PART 5: FULLSCREEN VIEWER
   ============================================================ */

let fsIndex = 0;
let fsTouchStartX = 0;

function openFullscreen(realIdx) {
  fsIndex = realIdx;
  renderFullscreen();
  document.getElementById('fullscreen-viewer').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
  document.getElementById('fullscreen-viewer').classList.add('hidden');
  document.body.style.overflow = '';
}

function renderFullscreen() {
  const p = PHOTOS[fsIndex];
  const img = document.getElementById('fs-img');
  if (p.src) {
    img.src = p.src;
    img.style.display = '';
  } else {
    img.src = '';
    img.style.display = 'none';
  }
  document.getElementById('fs-meta').innerHTML = '';
}

function fsStep(dir) {
  fsIndex = (fsIndex + dir + PHOTOS.length) % PHOTOS.length;
  renderFullscreen();
}

function initFullscreenViewer() {
  document.getElementById('fs-close').addEventListener('click', closeFullscreen);
  document.getElementById('fs-prev').addEventListener('click', () => fsStep(-1));
  document.getElementById('fs-next').addEventListener('click', () => fsStep(1));

  const viewer = document.getElementById('fullscreen-viewer');
  viewer.addEventListener('touchstart', e => { fsTouchStartX = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', e => {
    const diff = fsTouchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) fsStep(diff > 0 ? 1 : -1);
  });

  // Close on overlay tap
  viewer.querySelector('.fs-overlay').addEventListener('click', closeFullscreen);
}

/* ============================================================
   PART 6: QUIZ
   ============================================================ */

// ← Меняй вопросы здесь
// type отсутствует = обычный вопрос
// type:'yesno'  → кнопка "Нет" убегает
// type:'pet'    → особая ветка с питомцами
const QUIZ_QUESTIONS = [
  {
    q: 'Где мы познакомились? O_o',
    opts: ['Интернет', 'В Парке', 'В Кэшбеке', 'Хезе'],
    correct: 0,
    rightText: 'Йеессс🎉',
    rightGif: '',
    wrongPerOption: [null, 'Пани, вы шо тютю? Какой Парк 😶', 'Вы щас ряльна🤔?', 'Йоооооп, я вам не верю'],
    wrongGif: '',
  },
  {
    q: 'Када я в тебя влюбился?',
    opts: ['Концерт Монеточки', 'Наши разговоры и игры в РЕПО', 'Октоберфест'],
    correct: 0,
    rightText: 'Ну эт естесна ❤️',
    rightGif: '',
    wrongPerOption: [null, 'Эта была йоу, но не 😏', 'Ты шо, это первая встреча 👀'],
    wrongGif: '',
  },
  {
    type: 'pet',
    q: 'Кого мы заведем?',
    opts: [],
    correct: null,
    rightText: '',
    rightGif: '',
    wrongTexts: [],
    wrongGif: '',
  },
  {
    q: 'Твоя моя любимая фраза?',
    opts: ['ТИИИИИИ', 'А ты забавная малышка', 'Шо за зависимость?', 'Паняяятна', 'STOP IT!!!'],
    correct: null,
    rightText: 'Все ваши фразочки эта йоу',
    rightGif: '',
    wrongTexts: '',
    wrongGif: '',
  },
  {
    q: 'Как назовем сына?',
    opts: ['Только не Даня', 'Только не Никита', 'Только не Настя'],
    correct: null,
    rightText: 'Сагласен',
    rightGif: '',
    wrongTexts: [],
    wrongGif: '',
  },
  {
    type: 'yesno',
    q: 'Ты бы любила меня если бы у меня было по 3 пальца везде как у черепашек ниндзя и я был бы большим и зеленым?',
    correct: 0,
    rightText: 'Хехеххе! 💚',
    rightGif: '',
    wrongTexts: [],
    wrongGif: '',
  },
  {
    type: 'yesno',
    q: 'Ты будешь со мной заниматься дайвингом?',
    correct: 0,
    rightText: 'ЙООООУУУ! СЮДА 🤿',
    rightGif: '',
    wrongTexts: [],
    wrongGif: '',
  },
  {
    type: 'yesno',
    q: 'Мы так друг друга и не нарисовали, надо исправлять!',
    correct: 0,
    rightText: 'Таки да',
    rightGif: '',
    wrongTexts: [],
    wrongGif: '',
  },
];
let quizDone    = false;
let quizLocked  = false;
const quizAttempts = {};

function initQuiz() {
  if (quizDone) return;
  state.quizIndex = 0;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const wrap = document.getElementById('quiz-question-wrap');
  const fill = document.getElementById('quiz-progress-fill');
  const total = QUIZ_QUESTIONS.length;
  const idx   = state.quizIndex;

  fill.style.width = (idx / total * 100) + '%';

  if (idx >= total) {
    quizDone = true;
    fill.style.width = '100%';
    wrap.innerHTML = `
      <div style="text-align:center;padding:32px 0">
        <div style="font-size:56px;margin-bottom:16px">💖</div>
        <div style="font-size:20px;font-weight:600;color:#fff;margin-bottom:12px">Я тебе кохаю</div>
        <button class="btn-primary" id="quiz-finish-btn">Дальше →</button>
      </div>
    `;
    document.getElementById('quiz-finish-btn').addEventListener('click', () => {
      nextScreen();
      collapseProgress();
    });
    return;
  }

  quizLocked = false;
  const q = QUIZ_QUESTIONS[idx];

  if (q.type === 'yesno') { renderYesNoQuestion(q); return; }
  if (q.type === 'pet')   { renderPetQuestion();     return; }

  // Standard question
  wrap.innerHTML = `
    <p class="quiz-question">${q.q}</p>
    <div class="quiz-options">
      ${q.opts.map((o, i) => `<button class="quiz-option" data-i="${i}">${o}</button>`).join('')}
    </div>
  `;
  wrap.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      if (quizLocked) return;
      handleQuizAnswer(parseInt(btn.dataset.i));
    });
  });
}

/* ── YES/NO: убегающая кнопка "Нет" ─────────────────────── */

function renderYesNoQuestion(q) {
  const wrap = document.getElementById('quiz-question-wrap');
  wrap.innerHTML = `
    <p class="quiz-question">${q.q}</p>
    <div class="yesno-wrap" id="yesno-wrap">
      <button class="btn-primary yesno-yes" id="yn-yes">Да</button>
      <button class="btn-secondary yesno-no" id="yn-no">Нет</button>
    </div>
  `;
  document.getElementById('yn-yes').addEventListener('click', () => {
    if (quizLocked) return;
    quizLocked = true;
    showReaction(true, q.rightText, q.rightGif || '', () => {
      state.quizIndex++;
      renderQuizQuestion();
    });
  });
  document.getElementById('yn-no').addEventListener('click', (e) => {
    runAwayButton(e.currentTarget);
  });
}

function runAwayButton(btn) {
  const wrap = document.getElementById('yesno-wrap');
  if (!wrap) return;

  if (btn.style.position !== 'absolute') {
    const wRect = wrap.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    wrap.style.position = 'relative';
    wrap.style.minHeight = wRect.height + 'px';
    btn.style.position = 'absolute';
    btn.style.margin = '0';
    btn.style.left = (bRect.left - wRect.left) + 'px';
    btn.style.top  = (bRect.top  - wRect.top)  + 'px';
    btn.style.transition = 'left 0.22s ease, top 0.22s ease';
  }

  const wRect = wrap.getBoundingClientRect();
  const bRect = btn.getBoundingClientRect();
  const maxX  = wRect.width  - bRect.width;
  const maxY  = wRect.height - bRect.height;

  // Never land in same quadrant twice
  const newX = Math.max(0, Math.min(maxX, Math.random() * maxX));
  const newY = Math.max(0, Math.min(maxY, Math.random() * maxY));

  requestAnimationFrame(() => {
    btn.style.left = newX + 'px';
    btn.style.top  = newY + 'px';
  });
}

/* ── PET QUESTION: полная ветка ─────────────────────────── */

let petDogAttempts = 0;

function renderPetQuestion() {
  petDogAttempts = 0;
  const wrap = document.getElementById('quiz-question-wrap');
  wrap.innerHTML = `
    <p class="quiz-question">Какого домашнего питомца мы заведём?</p>
    <div class="quiz-options">
      <button class="quiz-option" id="pet-cat">🐱 Кошку</button>
      <button class="quiz-option" id="pet-dog">🐶 Собаку</button>
      <button class="quiz-option" id="pet-parrot">🦜 Попугая</button>
      <button class="quiz-option" id="pet-catdog">🐱🐶 Кошку и Собаку</button>
      <button class="quiz-option" id="pet-zoo">🐱🐶🦜🐠 Всех и ещё ченить</button>
    </div>
  `;
  quizLocked = false;

  document.getElementById('pet-cat').addEventListener('click', () => {
    if (quizLocked) return; quizLocked = true;
    showReaction(true, 'ШО РЯЛЬНА? ЙОООУ 🐱', '', () => { state.quizIndex++; renderQuizQuestion(); });
  });
  document.getElementById('pet-dog').addEventListener('click', () => {
    if (quizLocked) return;
    handlePetDog();
  });
  document.getElementById('pet-parrot').addEventListener('click', () => {
    if (quizLocked) return; quizLocked = true;
    showReaction(false, 'Панятнааа, вы уверены? 😶', '', () => {
      quizLocked = false;
      renderParrotConfirm();
    });
  });
  document.getElementById('pet-catdog').addEventListener('click', () => {
    if (quizLocked) return; quizLocked = true;
    showReaction(true, 'Ладна, так тоже пайдьот', '', () => { state.quizIndex++; renderQuizQuestion(); });
  });
  document.getElementById('pet-zoo').addEventListener('click', () => {
    if (quizLocked) return; quizLocked = true;
    showReaction(false, 'ЙООП та эта ж горб уже, У меня нет возможности финансировать 💸', 'images.jpg', renderPetZoo);
  });
}

function handlePetDog() {
  quizLocked = true;
  petDogAttempts++;
  if (petDogAttempts === 1) {
    showReaction(false, 'Панятна... а может всё-таки кицю? 🐱', '', renderPetDogRetry1);
  } else {
    showReaction(false, 'Кицю прям ваще не хочешь', '', renderPetDogRetry2);
  }
}

function renderPetDogRetry1() {
  const wrap = document.getElementById('quiz-question-wrap');
  wrap.innerHTML = `
    <p class="quiz-question">Панятна... а может всё-таки кошака? 🐱</p>
    <div class="quiz-options">
      <button class="quiz-option" id="dog-r1-yes">🐱 Та ладна ладна хай буде кошка</button>
      <button class="quiz-option" id="dog-r1-no">🐶 Заканчивай, я сказала собаку</button>
    </div>
  `;
  quizLocked = false;
  document.getElementById('dog-r1-yes').addEventListener('click', () => {
    if (quizLocked) return; quizLocked = true;
    showReaction(true, 'Летс гоууу 🐱', '', () => { state.quizIndex++; renderQuizQuestion(); });
  });
  document.getElementById('dog-r1-no').addEventListener('click', () => {
    if (quizLocked) return;
    handlePetDog();
  });
}

function renderPetDogRetry2() {
  const wrap = document.getElementById('quiz-question-wrap');
  wrap.innerHTML = `
    <p class="quiz-question">Ну паже Кицюнь, давай кицю</p>
    <div class="quiz-options">
      <button class="quiz-option" id="dog-r2-yes">🐱 Пупупу ладна</button>
      <button class="quiz-option" id="dog-r2-no">🐶 Ты шо с первого раза не вкурил?</button>
    </div>
  `;
  quizLocked = false;
  document.getElementById('dog-r2-yes').addEventListener('click', () => {
    if (quizLocked) return; quizLocked = true;
    showReaction(true, '❤️', '', () => { state.quizIndex++; renderQuizQuestion(); });
  });
  document.getElementById('dog-r2-no').addEventListener('click', () => {
    if (quizLocked) return; quizLocked = true;
    showReaction(false, 'Ясна 😭', '', () => {
      state.quizIndex++;
      renderQuizQuestion();
    });
  });
}

function renderPetZoo() {
  const wrap = document.getElementById('quiz-question-wrap');
  wrap.innerHTML = `
    <p class="quiz-question">У меня нет возможности финансировать 💸</p>
    <img src="images.jpg" alt="" style="width:100%;max-width:320px;border-radius:16px;margin:12px auto;display:block;object-fit:cover;">
    <div class="quiz-options">
      <button class="quiz-option" id="zoo-change">🔄 Сменить ответ</button>
      <button class="quiz-option" id="zoo-pay">💰 Спакуха, я плачу</button>
    </div>
  `;
  quizLocked = false;
  document.getElementById('zoo-change').addEventListener('click', () => {
    if (quizLocked) return;
    renderPetQuestion();
  });
  document.getElementById('zoo-pay').addEventListener('click', () => {
    if (quizLocked) return; quizLocked = true;
    showReaction(true, 'Не плачь 💸', '', () => {
      state.quizIndex++;
      renderQuizQuestion();
    });
  });
}

function renderParrotConfirm() {
  const wrap = document.getElementById('quiz-question-wrap');
  wrap.innerHTML = `
    <p class="quiz-question">Точно попугая? 🦜</p>
    <div class="quiz-options">
      <button class="quiz-option" id="parrot-yes">🦜 Так ты ж ниче на расказывешь, так хоть с ним трещать буду</button>
      <button class="quiz-option" id="parrot-no">🔄 Сменить ответ</button>
    </div>
  `;
  document.getElementById('parrot-yes').addEventListener('click', () => {
    if (quizLocked) return; quizLocked = true;
    showReaction(true, 'Абидна 😢', '', () => { state.quizIndex++; renderQuizQuestion(); });
  });
  document.getElementById('parrot-no').addEventListener('click', () => {
    if (quizLocked) return;
    renderPetQuestion();
  });
}

/* ── Стандартный обработчик для обычных вопросов ─────────── */

function handleQuizAnswer(optIdx) {
  if (quizLocked) return;
  quizLocked = true;

  const qIdx = state.quizIndex;
  const q    = QUIZ_QUESTIONS[qIdx];
  const isCorrect = (q.correct === null) || (optIdx === q.correct);

  if (isCorrect) {
    showReaction(true, q.rightText, q.rightGif || '', () => {
      state.quizIndex++;
      renderQuizQuestion();
    });
    return;
  }

  const perOpt = q.wrongPerOption && q.wrongPerOption[optIdx];
  const text   = perOpt || (Array.isArray(q.wrongTexts) && q.wrongTexts[0]) || 'Попробуй ещё раз 😄';

  showReaction(false, text, q.wrongGif || '', () => {
    renderQuizQuestion();
  });
}

/* ── Reaction overlay ────────────────────────────────────── */

function showReaction(isCorrect, text, gifUrl, onDone) {
  const overlay = document.getElementById('quiz-reaction');
  const gifEl   = document.getElementById('qr-gif');
  const emojiEl = document.getElementById('qr-emoji');
  const textEl  = document.getElementById('qr-text');

  textEl.textContent = text;

  if (gifUrl) {
    gifEl.src = gifUrl;
    gifEl.classList.remove('loaded');
    gifEl.onload = () => gifEl.classList.add('loaded');
    emojiEl.textContent = '';
  } else {
    gifEl.src = '';
    gifEl.classList.remove('loaded');
    emojiEl.textContent = isCorrect ? '🎉' : '🤨';
  }

  overlay.classList.remove('hidden');
  requestAnimationFrame(() => overlay.classList.add('visible'));

  const delay = gifUrl ? 2200 : 1700;
  setTimeout(() => {
    overlay.classList.remove('visible');
    setTimeout(() => {
      overlay.classList.add('hidden');
      onDone();
    }, 260);
  }, delay);
}

function showQuizFeedback() {}


/* ============================================================
   PART 8: FAKE ENDING + BLACK TRANSITION + FINAL REVEAL
   ============================================================ */

function triggerHiddenTransition() {
  // 1. Fade to black
  const overlay = document.getElementById('black-overlay');
  overlay.classList.add('active');

  // 2. After black — pulse heart
  setTimeout(() => {
    const heart = document.createElement('div');
    heart.className = 'overlay-heart';
    heart.textContent = '❤️';
    document.body.appendChild(heart);
    requestAnimationFrame(() => heart.classList.add('show'));

    // 3. After pulse — reveal final
    setTimeout(() => {
      heart.remove();
      overlay.classList.remove('active');
      showScreen(5);
      initFinalScene();
    }, 1800);
  }, 700);
}

/* ============================================================
   PART 9: CONFETTI + TYPEWRITER + FINAL SCENE
   ============================================================ */

// ← Edit this letter content
const FINAL_LETTER = `Кицюнь,

Сегодня твой особенный день, Я не особо красноречив как ты, но я попробую ^^

Ты принесла в мою жизнь чутка хаоса и перемен и дни перестали быть однообразными серыми и тусклыми

с тобой рядом я ощущаю спокойствие ну и чутка опаску (шо вы мне руку нахуй отгрызете но то такое)

я хочу чтобы всего что ты хочешь от жизни ты получила не важно что это, чтобы ты занималась чем ты хочешь и получала

от этого максимальное удоволствие ведь мне очень нравится смотреть как вы чемто увлечено занимаетесь :D

Ты меня научила жалеть себя как бы это не звучало но это для меня было важно хахаха

Я рад за то что ты у меня есть и что ты всегда рядом

С Днем Рождения❤️

P.S: Поднимитесь к себе :)`;

const CONFETTI_COLORS = ['#ff6b8a','#ff3366','#ffd700','#ff9aaf','#fff','#c0144a','#ffb3c6'];

function spawnConfetti() {
  const container = document.getElementById('confetti-container');
  const count = 80;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      p.style.width = (6 + Math.random() * 8) + 'px';
      p.style.height = (6 + Math.random() * 8) + 'px';
      p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      p.style.animationDuration = (3 + Math.random() * 4) + 's';
      p.style.animationDelay = '0s';
      container.appendChild(p);
      setTimeout(() => p.remove(), 8000);
    }, i * 40);
  }
  // Keep spawning
  setTimeout(spawnConfetti, 4000);
}

let typewriterActive = false;

function typewriterEffect(el, text, speed = 30) {
  typewriterActive = true;
  el.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  el.appendChild(cursor);

  let i = 0;
  const iv = setInterval(() => {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
    } else {
      clearInterval(iv);
      typewriterActive = false;
    }
  }, speed);
}

function initFinalScene() {
  restartMusic();
  spawnConfetti();

  setTimeout(() => {
    typewriterEffect(document.getElementById('final-letter'), FINAL_LETTER, 28);
  }, 800);
}

/* ============================================================
   PART 10: DOM INIT — load JSON then boot
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  initFullscreenViewer();

  document.getElementById('btn-close-exp').addEventListener('click', triggerHiddenTransition);
});
