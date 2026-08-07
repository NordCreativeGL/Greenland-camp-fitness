function buildPartExercise(categoryKey, part, weekIndex) {
  const categoryData = EXERCISES[categoryKey];
  const partData = categoryData[part];
  const weekEntry = partData.weeks[weekIndex];

  return {
    category: categoryKey,
    categoryLabel: categoryData.label,
    part,
    variantName: weekEntry.name || partData.name,
    type: partData.type,
    sets: weekEntry.sets,
    reps: weekEntry.reps,
    holdSeconds: weekEntry.holdSeconds,
    tempo: weekEntry.tempo,
    restSeconds: weekEntry.restSeconds,
    rir: weekEntry.rir,
    perSide: weekEntry.perSide,
    deload: weekEntry.deload,
    note: weekEntry.note
  };
}

function buildSingleSession(categories, weekIndex) {
  const categoryKey = categories[0];
  const categoryData = EXERCISES[categoryKey];

  if (categoryKey === 'conditioning') {
    const weekEntry = categoryData.primary.weeks[weekIndex];
    return {
      mode: 'single',
      exercises: [
        {
          category: categoryKey,
          categoryLabel: categoryData.label,
          part: 'primary',
          type: categoryData.primary.type,
          deload: weekEntry.deload,
          exercises: weekEntry.exercises
        }
      ]
    };
  }

  const exercises = [buildPartExercise(categoryKey, 'primary', weekIndex)];
  if (categoryData.secondary) {
    exercises.push(buildPartExercise(categoryKey, 'secondary', weekIndex));
  }

  return { mode: 'single', exercises };
}

function buildAlternatingSession(categories, weekIndex, finisherKey) {
  const [catA, catB] = categories;
  const dataA = EXERCISES[catA];
  const dataB = EXERCISES[catB];

  function buildPhaseExercise(categoryKey, categoryData, part) {
    const weekEntry = categoryData[part].weeks[weekIndex];
    return {
      category: categoryKey,
      categoryLabel: categoryData.label,
      part,
      variantName: weekEntry.name || categoryData[part].name,
      type: categoryData[part].type,
      reps: weekEntry.reps,
      holdSeconds: weekEntry.holdSeconds,
      tempo: weekEntry.tempo,
      perSide: weekEntry.perSide,
      deload: weekEntry.deload,
      note: weekEntry.note
    };
  }

  const primaryWeekA = dataA.primary.weeks[weekIndex];

  const result = {
    mode: 'alternating',
    categories,
    primaryPhase: {
      phase: 'primary',
      rounds: primaryWeekA.sets,
      restSeconds: primaryWeekA.restSeconds,
      exercises: [
        buildPhaseExercise(catA, dataA, 'primary'),
        buildPhaseExercise(catB, dataB, 'primary')
      ]
    },
    secondaryPhase: {
      phase: 'secondary',
      rounds: dataA.secondary.weeks[weekIndex].sets,
      restSeconds: dataA.secondary.weeks[weekIndex].restSeconds,
      exercises: [
        buildPhaseExercise(catA, dataA, 'secondary'),
        buildPhaseExercise(catB, dataB, 'secondary')
      ]
    }
  };

  if (finisherKey) {
    const finisherData = EXERCISES[finisherKey].finisher;
    result.finisher = {
      category: finisherKey,
      categoryLabel: EXERCISES[finisherKey].label,
      ...finisherData
    };
  }

  return result;
}

function buildLightDaySession(sessionSlot) {
  return {
    mode: 'lightDay',
    durationNote: sessionSlot.durationNote,
    note: sessionSlot.note,
    items: sessionSlot.items
  };
}

function getProgramForDay(dayNumber) {
  const weekNumber = Math.ceil(dayNumber / 7);
  const dayOfWeek = ((dayNumber - 1) % 7) + 1;
  const weekIndex = weekNumber - 1;

  const scheduleEntry = WEEKLY_SCHEDULE[dayOfWeek - 1];
  const isLightDay = scheduleEntry.isLightDay;

  const sessions = ['morgen', 'middag', 'aften'].map((session) => {
    const sessionSlot = scheduleEntry.sessions[session];
    let sessionResult;

    if (sessionSlot.mode === 'lightDay') {
      sessionResult = buildLightDaySession(sessionSlot);
    } else if (sessionSlot.mode === 'alternating') {
      sessionResult = buildAlternatingSession(sessionSlot.categories, weekIndex, sessionSlot.finisher);
    } else {
      sessionResult = buildSingleSession(sessionSlot.categories, weekIndex);
    }

    return { session, ...sessionResult };
  });

  return {
    dayNumber,
    weekNumber,
    dayOfWeek,
    isLightDay,
    sessions
  };
}
