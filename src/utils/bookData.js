// Утилита для загрузки и обработки данных о книгах
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к папке с JSON данными (корневая папка p-seo text)
const sourceDir = path.join(__dirname, '../../../p-seo text');

// Функция для динамической загрузки всех JSON файлов
function loadAllBooksData() {
  try {
    // Читаем все JSON файлы из папки p-seo text
    const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.json'));
    const booksData = [];

    files.forEach(file => {
      const filePath = path.join(sourceDir, file);
      try {
        const bookData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        booksData.push(bookData);
      } catch (error) {
        console.error(`Ошибка загрузки файла ${file}:`, error.message);
      }
    });

    console.log(`Загружено ${booksData.length} книг из ${files.length} файлов`);
    return booksData;
  } catch (error) {
    console.error('Ошибка при загрузке данных о книгах:', error.message);
    return [];
  }
}

// Массив всех книг
export const booksData = loadAllBooksData();

// Функция получения книги по ID
export function getBookById(id) {
  return booksData.find(book => book.id === id);
}

// Функция получения книги по slug
export function getBookBySlug(slug) {
  return booksData.find(book => book.slug === slug);
}

// Функция получения всех книг
export function getAllBooks() {
  return booksData;
}

// Функция получения случайной книги
export function getRandomBook() {
  return booksData[Math.floor(Math.random() * booksData.length)];
}

// Функция получения связанных книг (кроме текущей)
export function getRelatedBooks(currentBookId, limit = 3) {
  return booksData
    .filter(book => book.id !== currentBookId)
    .slice(0, limit);
}

// Функция генерации URL для книги
export function getBookUrl(book) {
  return `/${book.slug}`;
}

// Функция форматирования времени чтения
export function formatReadingTime(book) {
  const { reading_time, pages } = book.basic_info;
  return `${reading_time} • ${pages} страниц`;
}

// Функция получения сложности книги
export function getDifficultyLevel(book) {
  const difficulty = book.basic_info.difficulty;
  const levels = {
    'Легкая': { label: 'Легкая', color: 'green', icon: '🟢' },
    'Средняя': { label: 'Средняя', color: 'blue', icon: '🔵' },
    'Сложная': { label: 'Сложная', color: 'red', icon: '🔴' }
  };
  return levels[difficulty] || levels['Средняя'];
}