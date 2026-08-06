(function () {
  const TAB_KEY = 'camp_active_tab';
  const START_KEY = 'camp_start_date';
  const TOTAL_DAYS = 42;

  const SESSION_LABELS = { morgen: 'Morgen', middag: 'Middag', aften: 'Aften' };
  const RPE_OPTIONS = [
    { key: 'harder', label: 'sværere end forventet' },
    { key: 'asExpected', label: 'som forventet' },
    { key: 'easier', label: 'lettere end forventet' }
  ];

  let currentProgram = null;

  function setActiveTab(view) {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    document.querySelectorAll('.view').forEach((section) => {
      section.classList.toggle('active', section.id === `view-${view}`);
    });
  }

  function initTabs() {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        setActiveTab(view);
        localStorage.setItem(TAB_KEY, view);
        if (view === 'training') {
          renderTrainingView();
        }
      });
    });

    const savedTab = localStorage.getItem(TAB_KEY);
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }

  function getCurrentDayNumber() {
    const startDateRaw = localStorage.getItem(START_KEY);
    if (!startDateRaw) {
      return 1;
    }
    const startDate = new Date(startDateRaw);
    const today = new Date();
    return Math.min(
      TOTAL_DAYS,
      Math.max(1, Math.floor((today - startDate) / 86400000) + 1)
    );
  }

  function renderDayCounter() {
    const dayCounterEl = document.getElementById('day-counter');
    const startDateRaw = localStorage.getItem(START_KEY);

    if (!startDateRaw) {
      document.getElementById('start-overlay').classList.remove('hidden');
      return;
    }

    const dayNumber = getCurrentDayNumber();
    dayCounterEl.textContent = `DAG ${dayNumber} / ${TOTAL_DAYS}`;
  }

  function initStartOverlay() {
    document.getElementById('start-day-btn').addEventListener('click', () => {
      localStorage.setItem(START_KEY, new Date().toISOString());
      document.getElementById('start-overlay').classList.add('hidden');
      renderDayCounter();
      renderTrainingView();
    });
  }

  function getSetLog(logKey, setsTarget) {
    try {
      const raw = localStorage.getItem(logKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === setsTarget) {
          return parsed;
        }
      }
    } catch (e) {
      // fall through to a fresh log
    }
    return new Array(setsTarget).fill(false);
  }

  function saveSetLog(logKey, setLog) {
    localStorage.setItem(logKey, JSON.stringify(setLog));
  }

  function isExerciseComplete(setLog) {
    return setLog.length > 0 && setLog.every(Boolean);
  }

  function formatTarget(exercise) {
    if (exercise.type === 'reps') {
      return exercise.perSide
        ? `${exercise.setsTarget} sæt × ${exercise.repsTarget} reps pr. side`
        : `${exercise.setsTarget} sæt × ${exercise.repsTarget} reps`;
    }
    if (exercise.type === 'hold') {
      return `${exercise.setsTarget} sæt × ${exercise.holdSecondsTarget}s hold`;
    }
    if (exercise.type === 'amrap') {
      return `${exercise.amrapMinutes} min AMRAP`;
    }
    return '';
  }

  function updateSessionProgress(dayNumber, session) {
    const sessionData = currentProgram.sessions.find((s) => s.session === session);
    if (!sessionData) {
      return;
    }

    const total = sessionData.exercises.length;
    const completed = sessionData.exercises.reduce((count, exercise) => {
      const setsTarget = exercise.setsTarget || 1;
      const logKey = `log_day${dayNumber}_${exercise.category}_${session}`;
      const setLog = getSetLog(logKey, setsTarget);
      return isExerciseComplete(setLog) ? count + 1 : count;
    }, 0);

    const progressEl = document.querySelector(`[data-session-progress="${session}"]`);
    if (progressEl) {
      progressEl.textContent = `${completed}/${total} øvelser fuldført`;
    }
  }

  function buildExerciseCard(dayNumber, session, exercise) {
    const setsTarget = exercise.setsTarget || 1;
    const logKey = `log_day${dayNumber}_${exercise.category}_${session}`;
    const rpeKey = `rpe_day${dayNumber}_${exercise.category}_${session}`;

    const card = document.createElement('div');
    card.className = 'exercise-card';

    const nameEl = document.createElement('div');
    nameEl.className = 'exercise-name';
    nameEl.textContent = `${exercise.categoryLabel} — ${exercise.variantName}`;
    card.appendChild(nameEl);

    const targetEl = document.createElement('div');
    targetEl.className = 'exercise-target';
    targetEl.textContent = formatTarget(exercise);
    card.appendChild(targetEl);

    const setTracker = document.createElement('div');
    setTracker.className = 'set-tracker';
    const setLog = getSetLog(logKey, setsTarget);

    for (let i = 0; i < setsTarget; i++) {
      const setBtn = document.createElement('button');
      setBtn.type = 'button';
      setBtn.className = 'set-btn';
      setBtn.textContent = String(i + 1);
      setBtn.classList.toggle('checked', !!setLog[i]);
      setBtn.setAttribute('aria-pressed', String(!!setLog[i]));

      setBtn.addEventListener('click', () => {
        setLog[i] = !setLog[i];
        saveSetLog(logKey, setLog);
        setBtn.classList.toggle('checked', setLog[i]);
        setBtn.setAttribute('aria-pressed', String(setLog[i]));
        updateSessionProgress(dayNumber, session);
      });

      setTracker.appendChild(setBtn);
    }

    card.appendChild(setTracker);

    const rpeSelector = document.createElement('div');
    rpeSelector.className = 'rpe-selector';
    const savedRpe = localStorage.getItem(rpeKey);

    RPE_OPTIONS.forEach((option) => {
      const rpeBtn = document.createElement('button');
      rpeBtn.type = 'button';
      rpeBtn.className = 'rpe-btn';
      rpeBtn.textContent = option.label;
      rpeBtn.classList.toggle('selected', savedRpe === option.key);

      rpeBtn.addEventListener('click', () => {
        localStorage.setItem(rpeKey, option.key);
        rpeSelector.querySelectorAll('.rpe-btn').forEach((btn) => btn.classList.remove('selected'));
        rpeBtn.classList.add('selected');
      });

      rpeSelector.appendChild(rpeBtn);
    });

    card.appendChild(rpeSelector);

    return card;
  }

  function renderTrainingView() {
    const container = document.getElementById('view-training');
    const dayNumber = getCurrentDayNumber();
    currentProgram = getProgramForDay(dayNumber);

    container.innerHTML = '';

    if (currentProgram.isLightDay) {
      const banner = document.createElement('div');
      banner.className = 'light-day-banner';
      banner.textContent = 'Let dag — fokus på restitution';
      container.appendChild(banner);
    }

    currentProgram.sessions.forEach((sessionData) => {
      const details = document.createElement('details');
      details.className = 'session-block';
      details.open = true;

      const summary = document.createElement('summary');
      summary.className = 'session-header';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'session-name';
      nameSpan.textContent = SESSION_LABELS[sessionData.session];

      const progressSpan = document.createElement('span');
      progressSpan.className = 'session-progress';
      progressSpan.dataset.sessionProgress = sessionData.session;

      summary.appendChild(nameSpan);
      summary.appendChild(progressSpan);
      details.appendChild(summary);

      const body = document.createElement('div');
      body.className = 'session-body';

      sessionData.exercises.forEach((exercise) => {
        body.appendChild(buildExerciseCard(dayNumber, sessionData.session, exercise));
      });

      details.appendChild(body);
      container.appendChild(details);

      updateSessionProgress(dayNumber, sessionData.session);
    });
  }

  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js');
      });
    }
  }

  initTabs();
  initStartOverlay();
  renderDayCounter();
  renderTrainingView();
  initServiceWorker();
})();
