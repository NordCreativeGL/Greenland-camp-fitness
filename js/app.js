(function () {
  const TAB_KEY = 'camp_active_tab';
  const START_KEY = 'camp_start_date';
  const TOTAL_DAYS = 42;

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
      });
    });

    const savedTab = localStorage.getItem(TAB_KEY);
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }

  function renderDayCounter() {
    const dayCounterEl = document.getElementById('day-counter');
    const startDateRaw = localStorage.getItem(START_KEY);

    if (!startDateRaw) {
      document.getElementById('start-overlay').classList.remove('hidden');
      return;
    }

    const startDate = new Date(startDateRaw);
    const today = new Date();
    const dayNumber = Math.min(
      TOTAL_DAYS,
      Math.max(1, Math.floor((today - startDate) / 86400000) + 1)
    );
    dayCounterEl.textContent = `DAG ${dayNumber} / ${TOTAL_DAYS}`;
  }

  function initStartOverlay() {
    document.getElementById('start-day-btn').addEventListener('click', () => {
      localStorage.setItem(START_KEY, new Date().toISOString());
      document.getElementById('start-overlay').classList.add('hidden');
      renderDayCounter();
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
  initServiceWorker();
})();
