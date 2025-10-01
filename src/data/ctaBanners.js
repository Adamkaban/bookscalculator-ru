// data/ctaBanners.js
export const ctaBanners = [
  {
    id: 1,
    icon: "💡",
    title: "Средняя книга содержит около 300 страниц",
    subtitle: "Сколько книг вы сможете прочитать за год? Попробуйте наш калькулятор!",
    buttonText: "ПОПРОБОВАТЬ"
  },
  {
    id: 2,
    icon: "💡",
    title: "Средняя книга содержит 70,000 слов",
    subtitle: "Сколько книг вы сможете прочитать за год? Попробуйте наш калькулятор!",
    buttonText: "ПОПРОБОВАТЬ"
  }
];

// Функция случайного выбора
export function getRandomCTABanner() {
  return ctaBanners[Math.floor(Math.random() * ctaBanners.length)];
}