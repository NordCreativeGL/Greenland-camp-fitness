(function () {
  const TAB_KEY = `gcf:${CURRENT_PROFILE_ID}:camp_active_tab`;
  const START_KEY = `gcf:${CURRENT_PROFILE_ID}:${PROGRAM_VERSION}:camp_start_date`;
  const TOTAL_DAYS = 42;

  const SESSION_LABELS = { morgen: 'Morgen', middag: 'Middag', aften: 'Aften' };
  const RPE_OPTIONS = [
    { key: 'harder', label: 'Svært' },
    { key: 'asExpected', label: 'Forventet' },
    { key: 'easier', label: 'Let' }
  ];

  const SINGLE_CATEGORY_CODES = {
    legsQuad: 'LQ',
    legsHinge: 'LH',
    handstand: 'HS',
    coreSkillA: 'CSA',
    coreSkillB: 'CSB',
    conditioning: 'COND'
  };

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

  function buildLogKey(dayNumber, category, part, session) {
    return `gcf:${CURRENT_PROFILE_ID}:${PROGRAM_VERSION}:log_day${dayNumber}_${category}_${part}_${session}`;
  }

  function buildRpeKey(dayNumber, category, part, session) {
    return `gcf:${CURRENT_PROFILE_ID}:${PROGRAM_VERSION}:rpe_day${dayNumber}_${category}_${part}_${session}`;
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
    const parts = [];

    if (exercise.type === 'reps') {
      parts.push(exercise.perSide
        ? `${exercise.sets} sæt × ${exercise.reps} reps pr. side`
        : `${exercise.sets} sæt × ${exercise.reps} reps`);
    } else if (exercise.type === 'hold') {
      parts.push(`${exercise.sets} sæt × ${exercise.holdSeconds}s hold`);
    }

    if (exercise.tempo) {
      parts.push(`tempo ${exercise.tempo}`);
    }
    if (exercise.restSeconds) {
      parts.push(`${exercise.restSeconds}s pause`);
    }
    if (exercise.rir !== undefined && exercise.rir !== null) {
      parts.push(`RIR ${exercise.rir}`);
    }
    if (exercise.note) {
      parts.push(exercise.note);
    }

    return parts.join(' · ');
  }

  function mergePhaseExercise(exercise, phase) {
    return {
      ...exercise,
      sets: phase.rounds,
      restSeconds: phase.restSeconds
    };
  }

  function getLoggableExercises(sessionData) {
    if (sessionData.mode === 'single') {
      return sessionData.exercises.filter((exercise) => exercise.type !== 'circuit');
    }
    if (sessionData.mode === 'alternating') {
      return [
        ...sessionData.primaryPhase.exercises.map((exercise) => mergePhaseExercise(exercise, sessionData.primaryPhase)),
        ...sessionData.secondaryPhase.exercises.map((exercise) => mergePhaseExercise(exercise, sessionData.secondaryPhase))
      ];
    }
    return [];
  }

  function updateSessionProgress(dayNumber, session) {
    const sessionData = currentProgram.sessions.find((s) => s.session === session);
    if (!sessionData) {
      return;
    }

    const progressEl = document.querySelector(`[data-session-progress="${session}"]`);
    if (!progressEl) {
      return;
    }

    if (sessionData.mode === 'lightDay') {
      progressEl.textContent = [sessionData.durationNote, sessionData.note].filter(Boolean).join(' · ');
      return;
    }

    const loggable = getLoggableExercises(sessionData);
    if (loggable.length === 0) {
      progressEl.textContent = '';
      return;
    }

    const total = loggable.length;
    const completed = loggable.reduce((count, exercise) => {
      const setsTarget = exercise.sets || 1;
      const logKey = buildLogKey(dayNumber, exercise.category, exercise.part, session);
      const setLog = getSetLog(logKey, setsTarget);
      return isExerciseComplete(setLog) ? count + 1 : count;
    }, 0);

    progressEl.textContent = `${completed}/${total} øvelser fuldført`;
  }

  function buildExerciseCard(dayNumber, session, exercise) {
    const setsTarget = exercise.sets || 1;
    const logKey = buildLogKey(dayNumber, exercise.category, exercise.part, session);
    const rpeKey = buildRpeKey(dayNumber, exercise.category, exercise.part, session);

    const card = document.createElement('div');
    card.className = exercise.part === 'secondary'
      ? 'exercise-card exercise-card--secondary'
      : 'exercise-card card--bracket';

    const nameEl = document.createElement('div');
    nameEl.className = 'exercise-name';
    nameEl.textContent = `${exercise.categoryLabel} — ${exercise.variantName}` + (exercise.deload ? ' (deload)' : '');
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

  function buildCircuitCard(exercise) {
    const card = document.createElement('div');
    card.className = 'exercise-card';

    const nameEl = document.createElement('div');
    nameEl.className = 'exercise-name';
    nameEl.textContent = exercise.categoryLabel + (exercise.deload ? ' (deload)' : '');
    card.appendChild(nameEl);

    exercise.exercises.forEach((item) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'exercise-target';
      rowEl.textContent = `${item.name} — ${item.rounds} runder × ${item.workSeconds}s arbejde / ${item.restSeconds}s pause`;
      card.appendChild(rowEl);
    });

    return card;
  }

  function buildFinisherCard(finisher) {
    const card = document.createElement('div');
    card.className = 'exercise-card';

    const nameEl = document.createElement('div');
    nameEl.className = 'exercise-name';
    nameEl.textContent = `${finisher.categoryLabel} — ${finisher.label}`;
    card.appendChild(nameEl);

    finisher.exercises.forEach((item) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'exercise-target';
      rowEl.textContent = `${item.name} — ${item.sets} sæt × ${item.workSeconds}s`;
      card.appendChild(rowEl);
    });

    const metaEl = document.createElement('div');
    metaEl.className = 'exercise-target';
    metaEl.textContent = [finisher.durationNote, finisher.restNote].filter(Boolean).join(' · ');
    card.appendChild(metaEl);

    return card;
  }

  function formatLightItemTarget(item) {
    if (item.sets && item.reps) {
      return `${item.sets} sæt × ${item.reps} reps`;
    }
    if (item.sets && item.holdSeconds) {
      return `${item.sets} sæt × ${item.holdSeconds}s hold`;
    }
    return '';
  }

  function buildLightDayCard(item) {
    const card = document.createElement('div');
    card.className = 'exercise-card';

    const nameEl = document.createElement('div');
    nameEl.className = 'exercise-name';
    nameEl.textContent = item.name;
    card.appendChild(nameEl);

    const targetText = formatLightItemTarget(item);
    if (targetText) {
      const targetEl = document.createElement('div');
      targetEl.className = 'exercise-target';
      targetEl.textContent = targetText;
      card.appendChild(targetEl);
    }

    return card;
  }

  function buildPhaseHeader(phase) {
    const headerEl = document.createElement('div');
    headerEl.className = 'exercise-target';
    const names = phase.exercises.map((exercise) => exercise.variantName).join(' ↔ ');
    headerEl.textContent = `${phase.rounds} runder alternerende (${names}) · ${phase.restSeconds}s pause mellem runder`;
    return headerEl;
  }

  function renderSessionBody(dayNumber, sessionData) {
    const body = document.createElement('div');
    body.className = 'session-body';

    if (sessionData.mode === 'single') {
      sessionData.exercises.forEach((exercise) => {
        if (exercise.type === 'circuit') {
          body.appendChild(buildCircuitCard(exercise));
        } else {
          body.appendChild(buildExerciseCard(dayNumber, sessionData.session, exercise));
        }
      });
    } else if (sessionData.mode === 'alternating') {
      [sessionData.primaryPhase, sessionData.secondaryPhase].forEach((phase) => {
        body.appendChild(buildPhaseHeader(phase));
        phase.exercises.forEach((exercise) => {
          const displayExercise = mergePhaseExercise(exercise, phase);
          body.appendChild(buildExerciseCard(dayNumber, sessionData.session, displayExercise));
        });
      });
      if (sessionData.finisher) {
        body.appendChild(buildFinisherCard(sessionData.finisher));
      }
    } else if (sessionData.mode === 'lightDay') {
      sessionData.items.forEach((item) => {
        body.appendChild(buildLightDayCard(item));
      });
    }

    return body;
  }

  function getSessionCode(sessionSlot) {
    if (sessionSlot.mode === 'alternating') {
      const [catA, catB] = sessionSlot.categories;
      if (catA === 'push' && catB === 'pullVertical') {
        return 'PPA';
      }
      if (catA === 'dips' && catB === 'pullRow') {
        return 'PPB';
      }
    }
    return sessionSlot.categories.map((category) => SINGLE_CATEGORY_CODES[category] || category).join('/');
  }

  function buildWeekOverview(dayNumber) {
    const weekNumber = Math.ceil(dayNumber / 7);
    const weekStartDay = (weekNumber - 1) * 7 + 1;

    const strip = document.createElement('div');
    strip.className = 'week-overview';

    for (let i = 0; i < 7; i++) {
      const dNum = weekStartDay + i;
      const scheduleEntry = WEEKLY_SCHEDULE[i];

      const dayEl = document.createElement('div');
      dayEl.className = 'week-day';
      if (dNum === dayNumber) {
        dayEl.classList.add('today');
      }

      const numberEl = document.createElement('div');
      numberEl.className = 'week-day-number';
      numberEl.textContent = String(dNum);
      dayEl.appendChild(numberEl);

      const codesEl = document.createElement('div');
      codesEl.className = 'week-day-codes';

      const codes = scheduleEntry.isLightDay
        ? ['LET']
        : ['morgen', 'middag', 'aften'].map((session) => getSessionCode(scheduleEntry.sessions[session]));

      codes.forEach((code) => {
        const codeEl = document.createElement('div');
        codeEl.textContent = code;
        codesEl.appendChild(codeEl);
      });

      dayEl.appendChild(codesEl);
      strip.appendChild(dayEl);
    }

    return strip;
  }

  function renderTrainingView() {
    const container = document.getElementById('view-training');
    const dayNumber = getCurrentDayNumber();
    currentProgram = getProgramForDay(dayNumber);

    container.innerHTML = '';

    container.appendChild(buildWeekOverview(dayNumber));

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

      details.appendChild(renderSessionBody(dayNumber, sessionData));
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
