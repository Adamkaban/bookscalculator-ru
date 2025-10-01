// Логика калькулятора чтения
function calculateReading(minutesPerDay, wordsPerMinute, timePeriod) {
  const daysInPeriod = {
    '1 месяц': 30,
    '3 месяца': 90,
    '6 месяцев': 180,
    '1 год': 365,
    '10 лет': 3650,
    '50 лет': 18250
  };

  const totalWords = minutesPerDay * wordsPerMinute * daysInPeriod[timePeriod];
  const pages = Math.round(totalWords / 280); // среднее слов на странице
  const books = Math.round(pages / 300); // средняя книга 300 страниц

  return {
    totalWords: totalWords.toLocaleString('ru-RU'),
    pages: pages.toLocaleString('ru-RU'),
    books: books.toLocaleString('ru-RU')
  };
}

// Функция для открытия теста скорости чтения
function openSpeedTest() {
  window.open('https://runicelf.github.io/readtest/#top', '_blank', 'noopener,noreferrer');
}

// Функция инициализации калькулятора
export function initCalculator() {
  const minutesSelect = document.getElementById('minutes-per-day');
  const speedSelect = document.getElementById('reading-speed');
  const periodSelect = document.getElementById('time-period');
  const calculateButton = document.getElementById('calculate-button');
  const resultsDiv = document.getElementById('calculator-results');
  const speedTestButton = document.getElementById('speed-test-button');

  // Обработчик кнопки расчета
  if (calculateButton) {
    calculateButton.addEventListener('click', function() {
      const minutes = parseInt(minutesSelect.value);
      const speed = parseInt(speedSelect.value);
      const period = periodSelect.value;

      const result = calculateReading(minutes, speed, period);

      // Показываем результаты с анимацией
      resultsDiv.innerHTML = `
        <div class="results-card bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <h4 class="text-xl font-semibold text-slate-900 mb-4 text-center">Ваши результаты:</h4>
          <div class="grid md:grid-cols-3 gap-4">
            <div class="result-item text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">${result.totalWords}</div>
              <div class="text-sm text-slate-600">слов</div>
            </div>
            <div class="result-item text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">${result.pages}</div>
              <div class="text-sm text-slate-600">страниц</div>
            </div>
            <div class="result-item text-center p-4 bg-purple-50 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">${result.books}</div>
              <div class="text-sm text-slate-600">книг</div>
            </div>
          </div>
          <div class="text-center mt-4">
            <p class="text-sm text-slate-500">*Расчеты приблизительные, основаны на среднем количестве слов на странице (280) и в книге (300 страниц)</p>
          </div>
        </div>
      `;

      // Анимация появления результатов
      setTimeout(() => {
        resultsDiv.querySelector('.results-card').style.opacity = '0';
        resultsDiv.querySelector('.results-card').style.transform = 'translateY(20px)';
        resultsDiv.querySelector('.results-card').style.transition = 'all 0.5s ease-out';

        setTimeout(() => {
          resultsDiv.querySelector('.results-card').style.opacity = '1';
          resultsDiv.querySelector('.results-card').style.transform = 'translateY(0)';
        }, 100);
      }, 100);
    });
  }

  // Обработчик кнопки теста скорости
  if (speedTestButton) {
    speedTestButton.addEventListener('click', openSpeedTest);
  }

  // Автоматический расчет при изменении параметров
  function autoCalculate() {
    if (minutesSelect.value && speedSelect.value && periodSelect.value) {
      calculateButton.click();
    }
  }

  minutesSelect.addEventListener('change', autoCalculate);
  speedSelect.addEventListener('change', autoCalculate);
  periodSelect.addEventListener('change', autoCalculate);
}

// Экспортируем функции для использования в других модулях
export { calculateReading, openSpeedTest };