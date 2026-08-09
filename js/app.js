(function () {
  const TAB_KEY = `gcf:${CURRENT_PROFILE_ID}:camp_active_tab`;
  const START_KEY = `gcf:${CURRENT_PROFILE_ID}:${PROGRAM_VERSION}:camp_start_date`;
  const TOTAL_DAYS = 42;

  const SESSION_LABELS = { morgen: 'Morgen', middag: 'Middag', aften: 'Aften' };
  const RPE_OPTIONS = [
    { key: 'easier', label: 'Let' },
    { key: 'asExpected', label: 'Forventet' },
    { key: 'harder', label: 'Svært' }
  ];

  const SINGLE_CATEGORY_CODES = {
    legsQuad: 'LQ',
    legsHinge: 'LH',
    handstand: 'HS',
    coreSkillA: 'CSA',
    coreSkillB: 'CSB',
    conditioning: 'COND'
  };

  const GLOSSARY_SESSION_CODES = [
    ['PPA', 'Push-Pull A'],
    ['PPB', 'Push-Pull B'],
    ['LQ', 'Ben, squat'],
    ['LH', 'Ben, hofte/hamstring'],
    ['HS', 'Håndstand'],
    ['CSA', 'Core/Skill A — L-sit'],
    ['CSB', 'Core/Skill B — Dragon Flag'],
    ['COND', 'Kondition'],
    ['LET', 'Let dag']
  ];

  let currentProgram = null;

  function setActiveTab(view) {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    document.querySelectorAll('.view').forEach((section) => {
      section.classList.toggle('active', section.id === `view-${view}`);
    });
    document.querySelector('.tabbar').classList.toggle('hidden', view === 'dashboard');
  }

  function buildFoodLogKey(dayNumber) {
    return `gcf:${CURRENT_PROFILE_ID}:${PROGRAM_VERSION}:food_day${dayNumber}`;
  }

  function getFoodLog(dayNumber) {
    const raw = localStorage.getItem(buildFoodLogKey(dayNumber));
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveFoodLog(dayNumber, entries) {
    localStorage.setItem(buildFoodLogKey(dayNumber), JSON.stringify(entries));
  }

  function computeMacros(foodKey, grams) {
    const food = FOOD_DATABASE[foodKey];
    if (!food) {
      return null;
    }
    const factor = grams / 100;
    return {
      kcal: Math.round(food.kcal * factor),
      protein: Math.round(food.protein * factor * 10) / 10,
      carbs: Math.round(food.carbs * factor * 10) / 10,
      fat: Math.round(food.fat * factor * 10) / 10
    };
  }

  function renderFoodView() {
    const dayNumber = getCurrentDayNumber();
    const container = document.getElementById('view-food');
    const entries = getFoodLog(dayNumber);

    container.innerHTML = '';

    const form = document.createElement('div');
    form.className = 'food-form';

    const select = document.createElement('select');
    select.className = 'food-select';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Vælg fødevare';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    const categories = {};
    Object.keys(FOOD_DATABASE).forEach((key) => {
      const food = FOOD_DATABASE[key];
      if (!categories[food.category]) {
        categories[food.category] = [];
      }
      categories[food.category].push(key);
    });

    Object.keys(categories).forEach((category) => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = category;
      categories[category].forEach((key) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = FOOD_DATABASE[key].label;
        optgroup.appendChild(option);
      });
      select.appendChild(optgroup);
    });

    const gramsInput = document.createElement('input');
    gramsInput.type = 'number';
    gramsInput.className = 'food-grams-input';
    gramsInput.value = '200';
    gramsInput.min = '1';

    const addBtn = document.createElement('button');
    addBtn.className = 'food-add-btn';
    addBtn.textContent = 'Tilføj';
    addBtn.addEventListener('click', () => {
      const foodKey = select.value;
      const grams = parseInt(gramsInput.value, 10) || 0;
      if (!foodKey || grams <= 0) {
        return;
      }
      const macros = computeMacros(foodKey, grams);
      const newEntries = getFoodLog(dayNumber);
      newEntries.push({
        id: Date.now(),
        label: FOOD_DATABASE[foodKey].label,
        grams,
        kcal: macros.kcal,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat
      });
      saveFoodLog(dayNumber, newEntries);
      renderFoodView();
    });

    form.appendChild(select);
    form.appendChild(gramsInput);
    form.appendChild(addBtn);
    container.appendChild(form);

    const freetextCard = document.createElement('div');
    freetextCard.className = 'food-freetext-card';

    const freetextInput = document.createElement('input');
    freetextInput.type = 'text';
    freetextInput.className = 'food-freetext-input';
    freetextInput.placeholder = 'Andet — skriv hvad du spiste';

    const macroInputsRow = document.createElement('div');
    macroInputsRow.className = 'food-macro-inputs';

    const kcalInput = document.createElement('input');
    kcalInput.type = 'number';
    kcalInput.className = 'food-macro-input';
    kcalInput.placeholder = 'kcal';

    const proteinInput = document.createElement('input');
    proteinInput.type = 'number';
    proteinInput.className = 'food-macro-input';
    proteinInput.placeholder = 'Protein g';

    const carbsInput = document.createElement('input');
    carbsInput.type = 'number';
    carbsInput.className = 'food-macro-input';
    carbsInput.placeholder = 'Kulhydrat g';

    const fatInput = document.createElement('input');
    fatInput.type = 'number';
    fatInput.className = 'food-macro-input';
    fatInput.placeholder = 'Fedt g';

    macroInputsRow.appendChild(kcalInput);
    macroInputsRow.appendChild(proteinInput);
    macroInputsRow.appendChild(carbsInput);
    macroInputsRow.appendChild(fatInput);

    const freetextAddBtn = document.createElement('button');
    freetextAddBtn.className = 'food-add-btn food-add-btn--secondary';
    freetextAddBtn.textContent = 'Tilføj';
    freetextAddBtn.addEventListener('click', () => {
      const text = freetextInput.value.trim();
      if (!text) {
        return;
      }
      const kcalVal = kcalInput.value.trim() === '' ? null : parseFloat(kcalInput.value);
      const proteinVal = proteinInput.value.trim() === '' ? 0 : parseFloat(proteinInput.value);
      const carbsVal = carbsInput.value.trim() === '' ? 0 : parseFloat(carbsInput.value);
      const fatVal = fatInput.value.trim() === '' ? 0 : parseFloat(fatInput.value);

      const newEntries = getFoodLog(dayNumber);
      newEntries.push({
        id: Date.now(),
        label: text,
        grams: null,
        kcal: kcalVal !== null && !isNaN(kcalVal) ? kcalVal : null,
        protein: proteinVal,
        carbs: carbsVal,
        fat: fatVal
      });
      saveFoodLog(dayNumber, newEntries);
      renderFoodView();
    });

    freetextCard.appendChild(freetextInput);
    freetextCard.appendChild(macroInputsRow);
    freetextCard.appendChild(freetextAddBtn);
    container.appendChild(freetextCard);

    const totals = entries.reduce((acc, entry) => {
      if (entry.kcal !== null && entry.kcal !== undefined) {
        acc.kcal += entry.kcal;
        acc.protein += entry.protein || 0;
        acc.carbs += entry.carbs || 0;
        acc.fat += entry.fat || 0;
      }
      return acc;
    }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });

    const totalsEl = document.createElement('div');
    totalsEl.className = 'food-totals';
    const totalsValueEl = document.createElement('div');
    totalsValueEl.className = 'food-totals-value';
    totalsValueEl.textContent = `${Math.round(totals.kcal)} kcal`;
    const totalsMacrosEl = document.createElement('div');
    totalsMacrosEl.className = 'food-totals-macros';
    totalsMacrosEl.textContent = `P ${Math.round(totals.protein * 10) / 10}g · K ${Math.round(totals.carbs * 10) / 10}g · F ${Math.round(totals.fat * 10) / 10}g`;
    totalsEl.appendChild(totalsValueEl);
    totalsEl.appendChild(totalsMacrosEl);
    container.appendChild(totalsEl);

    const list = document.createElement('div');
    list.className = 'food-log-list';

    if (entries.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'food-log-empty';
      empty.textContent = 'Intet logget';
      list.appendChild(empty);
    }

    entries.forEach((entry) => {
      const row = document.createElement('div');
      row.className = 'food-log-row';

      const info = document.createElement('div');
      info.className = 'food-log-info';

      const nameEl = document.createElement('div');
      nameEl.className = 'food-log-name';
      nameEl.textContent = entry.grams ? `${entry.label} · ${entry.grams}g` : entry.label;
      info.appendChild(nameEl);

      const macroEl = document.createElement('div');
      macroEl.className = 'food-log-macros';
      macroEl.textContent = (entry.kcal !== null && entry.kcal !== undefined)
        ? `${entry.kcal} kcal · P ${entry.protein}g · K ${entry.carbs}g · F ${entry.fat}g`
        : 'Ikke beregnet';
      info.appendChild(macroEl);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'food-log-remove';
      removeBtn.setAttribute('aria-label', 'Fjern');
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        const filtered = getFoodLog(dayNumber).filter((e) => e.id !== entry.id);
        saveFoodLog(dayNumber, filtered);
        renderFoodView();
      });

      row.appendChild(info);
      row.appendChild(removeBtn);
      list.appendChild(row);
    });

    container.appendChild(list);
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
        if (view === 'food') {
          renderFoodView();
        }
      });
    });

    const savedTab = localStorage.getItem(TAB_KEY);
    if (savedTab) {
      setActiveTab(savedTab);
      if (savedTab === 'food') {
        renderFoodView();
      }
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

  const PROGRAM_PHASES = [
    { weeks: [1], label: 'Kalibrering' },
    { weeks: [2, 3], label: 'Akkumulering' },
    { weeks: [4], label: 'Konsolidering' },
    { weeks: [5, 6], label: 'Intensivering' }
  ];

  function getPhaseLabel(weekNumber) {
    const phase = PROGRAM_PHASES.find((p) => p.weeks.includes(weekNumber));
    return phase ? phase.label : '';
  }

  function getDayCompletion(dayNumber) {
    const program = getProgramForDay(dayNumber);
    let total = 0;
    let completed = 0;

    program.sessions.forEach((sessionData) => {
      if (sessionData.mode === 'lightDay') {
        return;
      }
      getLoggableExercises(sessionData).forEach((exercise) => {
        const setsTarget = exercise.sets || 1;
        const logKey = buildLogKey(dayNumber, exercise.category, exercise.part, sessionData.session);
        const setLog = getSetLog(logKey, setsTarget);
        total += 1;
        if (isExerciseComplete(setLog)) {
          completed += 1;
        }
      });
    });

    return { completed, total };
  }

  function getDashboardSummary(dayNumber = getCurrentDayNumber()) {
    const program = getProgramForDay(dayNumber);
    const scheduleEntry = WEEKLY_SCHEDULE[program.dayOfWeek - 1];
    const completion = getDayCompletion(dayNumber);

    const sessionCodes = program.isLightDay
      ? ['LET']
      : ['morgen', 'middag', 'aften'].map((session) => getSessionCode(scheduleEntry.sessions[session]));

    return {
      dayNumber,
      weekNumber: program.weekNumber,
      phaseLabel: getPhaseLabel(program.weekNumber),
      isLightDay: program.isLightDay,
      sessionCodes,
      completed: completion.completed,
      total: completion.total
    };
  }

  function isDayFullyComplete(dayNumber) {
    const completion = getDayCompletion(dayNumber);
    return completion.total === 0 || completion.completed === completion.total;
  }

  function getWeekSetsLogged(weekNumber) {
    const weekStartDay = (weekNumber - 1) * 7 + 1;
    let totalSets = 0;

    for (let i = 0; i < 7; i++) {
      const dayNumber = weekStartDay + i;
      if (dayNumber > TOTAL_DAYS) {
        break;
      }
      const program = getProgramForDay(dayNumber);
      program.sessions.forEach((sessionData) => {
        if (sessionData.mode === 'lightDay') {
          return;
        }
        getLoggableExercises(sessionData).forEach((exercise) => {
          const setsTarget = exercise.sets || 1;
          const logKey = buildLogKey(dayNumber, exercise.category, exercise.part, sessionData.session);
          const setLog = getSetLog(logKey, setsTarget);
          totalSets += setLog.filter(Boolean).length;
        });
      });
    }

    return totalSets;
  }

  function getStreak(todayNumber) {
    let streak = 0;
    let d = todayNumber;
    if (!isDayFullyComplete(d)) {
      d -= 1;
    }
    while (d >= 1 && isDayFullyComplete(d)) {
      streak += 1;
      d -= 1;
    }
    return streak;
  }

  let dashboardViewedWeek = null;

  function renderDashboardWeekStrip(weekNumber) {
    const todayNumber = getCurrentDayNumber();
    const weekStartDay = (weekNumber - 1) * 7 + 1;
    const weekEndDay = Math.min(TOTAL_DAYS, weekStartDay + 6);

    document.getElementById('dashboard-week-range').textContent =
      `Uge ${weekNumber} · Dag ${weekStartDay}–${weekEndDay}`;

    const strip = document.getElementById('dashboard-week-strip');
    strip.innerHTML = '';

    for (let dayNumber = weekStartDay; dayNumber <= weekEndDay; dayNumber++) {
      const isDone = dayNumber <= todayNumber && isDayFullyComplete(dayNumber);

      const dayEl = document.createElement('div');
      dayEl.className = 'dashboard-week-day';
      dayEl.classList.toggle('today', dayNumber === todayNumber);
      dayEl.classList.toggle('done', isDone);

      const numberEl = document.createElement('div');
      numberEl.textContent = String(dayNumber);
      dayEl.appendChild(numberEl);

      const scheduleEntry = WEEKLY_SCHEDULE[dayNumber - weekStartDay];
      const codesEl = document.createElement('div');
      codesEl.className = 'dashboard-week-day-codes';
      const codes = scheduleEntry.isLightDay
        ? ['LET']
        : ['morgen', 'middag', 'aften'].map((session) => getSessionCode(scheduleEntry.sessions[session]));
      codes.forEach((code) => {
        const codeEl = document.createElement('div');
        codeEl.textContent = code;
        codesEl.appendChild(codeEl);
      });
      dayEl.appendChild(codesEl);

      const dotEl = document.createElement('div');
      dotEl.className = 'dashboard-week-day-dot';
      dayEl.appendChild(dotEl);

      dayEl.addEventListener('click', () => {
        setActiveTab('training');
        localStorage.setItem(TAB_KEY, 'training');
        renderTrainingView(dayNumber);
      });

      strip.appendChild(dayEl);
    }

    document.getElementById('week-prev-btn').disabled = weekNumber <= 1;
    document.getElementById('week-next-btn').disabled = weekNumber >= Math.ceil(TOTAL_DAYS / 7);
  }

  function renderDayCounter(dayNumber) {
    const dayCounterEl = document.getElementById('day-counter');
    const startDateRaw = localStorage.getItem(START_KEY);

    if (!startDateRaw) {
      setActiveTab('dashboard');
      return;
    }

    const displayDay = dayNumber === undefined ? getCurrentDayNumber() : dayNumber;
    dayCounterEl.textContent = `DAG ${displayDay} / ${TOTAL_DAYS}`;
  }

  function renderDashboardStatus() {
    const summary = getDashboardSummary();
    const todayNumber = summary.dayNumber;

    document.getElementById('dashboard-day-label').textContent = `Dag ${summary.dayNumber}`;
    document.getElementById('dashboard-week-label').textContent = `Uge ${summary.weekNumber}`;
    document.getElementById('dashboard-phase').textContent = summary.phaseLabel;

    const sessionsEl = document.getElementById('dashboard-sessions');
    sessionsEl.innerHTML = '';
    summary.sessionCodes.forEach((code) => {
      const pill = document.createElement('span');
      pill.className = 'dashboard-session-pill';
      pill.textContent = code;
      sessionsEl.appendChild(pill);
    });

    const pct = summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 100;
    document.getElementById('dashboard-progress-fill').style.width = `${pct}%`;
    document.getElementById('dashboard-progress-label').textContent = summary.isLightDay
      ? 'Aktiv restitution'
      : `${summary.completed}/${summary.total} øvelser fuldført`;

    document.getElementById('dashboard-kost-day-label').textContent = `Dag ${summary.dayNumber}`;

    const foodEntries = getFoodLog(summary.dayNumber);
    const foodTotals = foodEntries.reduce((acc, entry) => {
      if (!entry.isFreetext) {
        acc.kcal += entry.kcal;
      }
      acc.count += 1;
      return acc;
    }, { kcal: 0, count: 0 });

    document.getElementById('dashboard-kost-summary').textContent = foodTotals.count > 0
      ? `${Math.round(foodTotals.kcal)} kcal logget i dag (${foodTotals.count} ${foodTotals.count === 1 ? 'post' : 'poster'})`
      : 'Intet logget';

    document.getElementById('stat-sets').textContent = getWeekSetsLogged(summary.weekNumber);
    document.getElementById('stat-streak').textContent = getStreak(todayNumber);
    document.getElementById('stat-program').textContent = `${Math.round((todayNumber / TOTAL_DAYS) * 100)}%`;

    dashboardViewedWeek = summary.weekNumber;
    renderDashboardWeekStrip(dashboardViewedWeek);
  }

  function initDashboard() {
    renderDashboardStatus();

    document.getElementById('start-day-btn').addEventListener('click', () => {
      if (!localStorage.getItem(START_KEY)) {
        localStorage.setItem(START_KEY, new Date().toISOString());
      }
      setActiveTab('training');
      localStorage.setItem(TAB_KEY, 'training');
      renderDayCounter();
      renderTrainingView();
    });

    document.getElementById('food-day-btn').addEventListener('click', () => {
      setActiveTab('food');
      localStorage.setItem(TAB_KEY, 'food');
      renderFoodView();
    });

    document.getElementById('app-title').addEventListener('click', () => {
      renderDashboardStatus();
      setActiveTab('dashboard');
    });

    document.getElementById('week-prev-btn').addEventListener('click', () => {
      if (dashboardViewedWeek > 1) {
        dashboardViewedWeek -= 1;
        renderDashboardWeekStrip(dashboardViewedWeek);
      }
    });

    document.getElementById('week-next-btn').addEventListener('click', () => {
      if (dashboardViewedWeek < Math.ceil(TOTAL_DAYS / 7)) {
        dashboardViewedWeek += 1;
        renderDashboardWeekStrip(dashboardViewedWeek);
      }
    });
  }

  function buildGlossarySection(heading, bodyEl) {
    const section = document.createElement('div');
    section.className = 'glossary-section';

    const headingEl = document.createElement('h3');
    headingEl.textContent = heading;
    section.appendChild(headingEl);
    section.appendChild(bodyEl);

    return section;
  }

  function buildGlossaryContent() {
    const wrapper = document.createDocumentFragment();

    const codesList = document.createElement('dl');
    codesList.className = 'glossary-list';
    GLOSSARY_SESSION_CODES.forEach(([code, description]) => {
      const row = document.createElement('div');
      row.className = 'glossary-row';

      const dt = document.createElement('dt');
      dt.textContent = code;
      const dd = document.createElement('dd');
      dd.textContent = description;

      row.appendChild(dt);
      row.appendChild(dd);
      codesList.appendChild(row);
    });
    wrapper.appendChild(buildGlossarySection('Session-koder', codesList));

    const tempoText = document.createElement('p');
    tempoText.textContent = 'Fire tal = excentrisk-pause-koncentrisk-pause i sekunder (fx 2-0-1-1 = 2s ned, 0s pause, 1s op, 1s pause i top).';
    wrapper.appendChild(buildGlossarySection('Tempo', tempoText));

    const rirText = document.createElement('p');
    rirText.textContent = 'Reps tilbage i tanken før du ville fejle sættet.';
    wrapper.appendChild(buildGlossarySection('RIR', rirText));

    return wrapper;
  }

  function initGlossary() {
    const overlay = document.getElementById('glossary-overlay');
    const content = document.getElementById('glossary-content');
    content.appendChild(buildGlossaryContent());

    document.getElementById('glossary-btn').addEventListener('click', () => {
      overlay.classList.remove('hidden');
    });
    document.getElementById('glossary-close-btn').addEventListener('click', () => {
      overlay.classList.add('hidden');
    });
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        overlay.classList.add('hidden');
      }
    });
  }

  function initMenu() {
    const overlay = document.getElementById('menu-overlay');
    document.getElementById('menu-btn').addEventListener('click', () => {
      overlay.classList.remove('hidden');
    });
    document.getElementById('menu-close-btn').addEventListener('click', () => {
      overlay.classList.add('hidden');
    });
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        overlay.classList.add('hidden');
      }
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

  function formatTempo(tempo) {
    return String(tempo).split('').join('-');
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
      parts.push(`tempo ${formatTempo(exercise.tempo)}`);
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

  const TEMPO_PHASE_LABELS = ['excentrisk (ned)', 'pause i bund', 'koncentrisk (op)', 'pause i top'];

  function buildDecoderBlock(exercise) {
    const fragment = document.createDocumentFragment();

    if (exercise.type === 'reps' && exercise.tempo) {
      const heading = document.createElement('div');
      heading.className = 'card-back-heading';
      heading.textContent = `Tempo ${formatTempo(exercise.tempo)}`;
      fragment.appendChild(heading);

      const digits = String(exercise.tempo).split('');
      const decoded = digits.map((digit, i) => `${digit}s ${TEMPO_PHASE_LABELS[i]}`).join(' · ');
      const line = document.createElement('div');
      line.className = 'card-back-text';
      line.textContent = decoded;
      fragment.appendChild(line);
    }

    if (exercise.rir !== undefined && exercise.rir !== null) {
      const heading = document.createElement('div');
      heading.className = 'card-back-heading';
      heading.textContent = `RIR ${exercise.rir}`;
      fragment.appendChild(heading);

      const line = document.createElement('div');
      line.className = 'card-back-text';
      line.textContent = `${exercise.rir} reps tilbage i tanken før du ville fejle sættet`;
      fragment.appendChild(line);
    }

    return fragment;
  }

  function buildFormGuideList(exercise) {
    const cues = FORM_GUIDE[exercise.variantName];
    if (!cues) {
      return null;
    }

    const list = document.createElement('ul');
    list.className = 'card-back-cues';
    cues.forEach((cue) => {
      const li = document.createElement('li');
      li.textContent = cue;
      list.appendChild(li);
    });
    return list;
  }

  function buildInfoButton(label, symbol) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'glossary-btn card-info-btn';
    btn.setAttribute('aria-label', label);
    btn.textContent = symbol;
    return btn;
  }

  function buildExerciseCardBack(exercise, isSecondary) {
    const card = document.createElement('div');
    card.className = isSecondary
      ? 'exercise-card exercise-card--secondary card-face card-face--back'
      : 'exercise-card card--bracket card-face card-face--back';

    const nameEl = document.createElement('div');
    nameEl.className = 'exercise-name card-back-name';
    nameEl.textContent = `${exercise.categoryLabel} — ${exercise.variantName}`;
    card.appendChild(nameEl);

    card.appendChild(buildDecoderBlock(exercise));

    const divider = document.createElement('hr');
    divider.className = 'card-back-divider';
    card.appendChild(divider);

    const cuesList = buildFormGuideList(exercise);
    if (cuesList) {
      card.appendChild(cuesList);
    }

    return card;
  }

  function buildExerciseCard(dayNumber, session, exercise, interactive) {
    const setsTarget = exercise.sets || 1;
    const logKey = buildLogKey(dayNumber, exercise.category, exercise.part, session);
    const rpeKey = buildRpeKey(dayNumber, exercise.category, exercise.part, session);
    const isSecondary = exercise.part === 'secondary';

    const card = document.createElement('div');
    card.className = isSecondary
      ? 'exercise-card exercise-card--secondary card-face card-face--front'
      : 'exercise-card card--bracket card-face card-face--front';

    const headerRow = document.createElement('div');
    headerRow.className = 'card-header';

    const nameEl = document.createElement('div');
    nameEl.className = 'exercise-name';
    nameEl.textContent = `${exercise.categoryLabel} — ${exercise.variantName}` + (exercise.deload ? ' (deload)' : '');
    headerRow.appendChild(nameEl);

    const infoBtn = buildInfoButton('Vis teknik-info', '→');
    headerRow.appendChild(infoBtn);

    card.appendChild(headerRow);

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
      setBtn.disabled = !interactive;

      if (interactive) {
        setBtn.addEventListener('click', () => {
          setLog[i] = !setLog[i];
          saveSetLog(logKey, setLog);
          setBtn.classList.toggle('checked', setLog[i]);
          setBtn.setAttribute('aria-pressed', String(setLog[i]));
          updateSessionProgress(dayNumber, session);
        });
      }

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
      rpeBtn.disabled = !interactive;

      if (interactive) {
        rpeBtn.addEventListener('click', () => {
          localStorage.setItem(rpeKey, option.key);
          rpeSelector.querySelectorAll('.rpe-btn').forEach((btn) => btn.classList.remove('selected'));
          rpeBtn.classList.add('selected');
        });
      }

      rpeSelector.appendChild(rpeBtn);
    });

    card.appendChild(rpeSelector);

    const flipWrap = document.createElement('div');
    flipWrap.className = 'card-flip';

    const flipInner = document.createElement('div');
    flipInner.className = 'card-flip-inner';

    infoBtn.addEventListener('click', () => flipWrap.classList.add('flipped'));

    const backCard = buildExerciseCardBack(exercise, isSecondary);
    const closeBtn = buildInfoButton('Luk teknik-info', '×');
    closeBtn.addEventListener('click', () => flipWrap.classList.remove('flipped'));
    backCard.appendChild(closeBtn);

    flipInner.appendChild(card);
    flipInner.appendChild(backCard);
    flipWrap.appendChild(flipInner);

    return flipWrap;
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

  function buildSupersetBadge() {
    const badge = document.createElement('div');
    badge.className = 'superset-badge';
    badge.textContent = 'Supersæt';
    return badge;
  }

  function renderSessionBody(dayNumber, sessionData, interactive) {
    const body = document.createElement('div');
    body.className = 'session-body';

    if (sessionData.mode === 'single') {
      sessionData.exercises.forEach((exercise) => {
        if (exercise.type === 'circuit') {
          body.appendChild(buildCircuitCard(exercise));
        } else {
          body.appendChild(buildExerciseCard(dayNumber, sessionData.session, exercise, interactive));
        }
      });
    } else if (sessionData.mode === 'alternating') {
      [sessionData.primaryPhase, sessionData.secondaryPhase].forEach((phase) => {
        body.appendChild(buildSupersetBadge());
        phase.exercises.forEach((exercise) => {
          const displayExercise = mergePhaseExercise(exercise, phase);
          body.appendChild(buildExerciseCard(dayNumber, sessionData.session, displayExercise, interactive));
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

  function buildWeekOverview(viewedDayNumber, todayNumber) {
    const weekNumber = Math.ceil(todayNumber / 7);
    const weekStartDay = (weekNumber - 1) * 7 + 1;

    const strip = document.createElement('div');
    strip.className = 'week-overview';

    for (let i = 0; i < 7; i++) {
      const dNum = weekStartDay + i;
      const scheduleEntry = WEEKLY_SCHEDULE[i];

      const dayEl = document.createElement('div');
      dayEl.className = 'week-day';
      dayEl.classList.toggle('viewing', dNum === viewedDayNumber);
      dayEl.classList.toggle('today', dNum === todayNumber);
      dayEl.addEventListener('click', () => {
        renderTrainingView(dNum);
      });

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

  function renderTrainingView(dayNumber = getCurrentDayNumber()) {
    const container = document.getElementById('view-training');
    const todayNumber = getCurrentDayNumber();
    const viewedDay = Math.min(TOTAL_DAYS, Math.max(1, dayNumber));
    const interactive = viewedDay <= todayNumber;

    currentProgram = getProgramForDay(viewedDay);

    renderDayCounter(viewedDay);

    container.innerHTML = '';

    container.appendChild(buildWeekOverview(viewedDay, todayNumber));

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

      details.appendChild(renderSessionBody(viewedDay, sessionData, interactive));
      container.appendChild(details);

      updateSessionProgress(viewedDay, sessionData.session);
    });
  }

  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js');
      });
    }
  }

  function initSplash() {
    window.setTimeout(() => {
      document.getElementById('splash-screen').classList.add('splash-hidden');
    }, 900);
  }

  initTabs();
  initDashboard();
  initGlossary();
  initMenu();
  renderDayCounter();
  renderTrainingView();
  initServiceWorker();
  initSplash();
})();
