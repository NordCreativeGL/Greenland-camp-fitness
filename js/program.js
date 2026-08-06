function getProgramForDay(dayNumber) {
  const weekNumber = Math.ceil(dayNumber / 7);
  const dayOfWeek = ((dayNumber - 1) % 7) + 1;
  const blockIndex = Math.min(Math.floor((weekNumber - 1) / 2), 2);
  const weekInBlock = ((weekNumber - 1) % 2) + 1;

  const scheduleEntry = WEEKLY_SCHEDULE[dayOfWeek - 1];
  const isLightDay = scheduleEntry.isLightDay;

  function buildExercise(category) {
    const categoryData = EXERCISES[category];

    if (isLightDay) {
      return {
        category,
        categoryLabel: categoryData.label,
        variantName: 'Let ' + categoryData.label,
        type: 'hold',
        holdSecondsTarget: 300,
        setsTarget: 1,
        isCalibration: false
      };
    }

    if (category === 'conditioning') {
      const finisher = EXERCISES.conditioning.finishers[dayNumber % EXERCISES.conditioning.finishers.length];
      return {
        category: 'conditioning',
        categoryLabel: 'Conditioning',
        variantName: finisher,
        type: 'amrap',
        amrapMinutes: 3,
        isCalibration: false
      };
    }

    if (category === 'dips' && dayNumber <= 3) {
      const variant = EXERCISES.dips.calibration;
      return {
        category: 'dips',
        categoryLabel: categoryData.label,
        variantName: variant.name,
        type: variant.type,
        holdSecondsTarget: variant.baseHoldSeconds,
        setsTarget: variant.setsTarget,
        isCalibration: true
      };
    }

    const variantIndex = Math.min(blockIndex, categoryData.variants.length - 1);
    const variant = categoryData.variants[variantIndex];

    const exercise = {
      category,
      categoryLabel: categoryData.label,
      variantName: variant.name,
      type: variant.type,
      setsTarget: variant.setsTarget,
      perSide: variant.perSide,
      isCalibration: false
    };

    if (variant.type === 'reps') {
      exercise.repsTarget = variant.baseReps + (weekInBlock - 1);
    } else if (variant.type === 'hold') {
      exercise.holdSecondsTarget = variant.baseHoldSeconds + (weekInBlock - 1) * 2;
    }

    return exercise;
  }

  const sessions = ['morgen', 'middag', 'aften'].map((session) => ({
    session,
    exercises: scheduleEntry.sessions[session].map(buildExercise)
  }));

  return {
    dayNumber,
    weekNumber,
    dayOfWeek,
    isLightDay,
    blockIndex,
    sessions
  };
}
