<!-- ---

# 🚀 Crypto Watcher Backend (Strapi + Docker)

Інфраструктура проєкту побудована на **Docker**, що дозволяє запустити бекенд, базу даних та кеш однією командою. Це забезпечує стабільність середовища розробки незалежно від операційної системи.

## 🛠 Стек технологій

* **Framework:** Strapi v5 (Node.js 18+)
* **Database:** PostgreSQL 15
* **Cache:** Redis 7
* **Containerization:** Docker & Docker Compose

---

## 🏗 Підготовка та перший запуск

1. **Запустіть Docker Desktop.** Переконайтеся, що іконка кита в треї активна.
2. **Налаштуйте змінні оточення:**
   Створіть файл `.env` у папці `/backend`. Скопіюйте туди налаштування для підключення до бази даних (вони мають збігатися з параметрами у `docker-compose.yml`):

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=strapi-db
DATABASE_PORT=5432
DATABASE_NAME=crypto_watcher
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=password
DATABASE_SSL=false

```

3. **Зберіть та запустіть проєкт:**
   У кореневій директорії (там, де файл `docker-compose.yml`) виконайте:

```bash
docker-compose up --build

```

_Після завершення збірки адмін-панель буде доступна за адресою:_ [http://localhost:1337/admin]()

---

## 💻 Щоденна робота

### Запуск проєкту (вранці)

Запустити контейнери у фоновому режимі:

```bash
docker-compose up -d

```

### Зупинка проєкту (ввечері)

Зупинити роботу сервісів (дані в БД збережуться завдяки Volumes):

```bash
docker-compose stop

```

> **Примітка:** Якщо потрібно повністю видалити контейнери та внутрішні мережі, використовуйте `docker-compose down`.

### Перегляд логів

Якщо потрібно побачити помилки або процес роботи Strapi в реальному часі:

```bash
docker-compose logs -f strapi

```

---

## 📦 Встановлення нових бібліотек

Якщо вам потрібно додати нову бібліотеку (наприклад, `axios` або `pg`):

1. **Встановіть її локально** у папці `backend`:

```bash
cd backend
npm install <library_name>

```

2. **Перезберіть Docker-образ**, щоб зміни потрапили всередину контейнера:

```bash
cd ..
docker-compose build strapi
docker-compose up -d

```

---

## ⚠️ Вирішення проблем (Troubleshooting)

- **Помилка "initializeDriver":** Переконайтеся, що ви встановили драйвер PostgreSQL (`npm install pg`) та перезібрали контейнер через `build`.
- **Зміни в коді не відображаються:** Оскільки код "запікається" в образ під час збірки, після зміни файлів потрібно перезапускати збірку: `docker-compose up --build`.
- **Контейнер Strapi падає з кодом 0:** Перевірте логи через `docker-compose logs strapi`. Найчастіше це помилка підключення до БД через невірні дані в файлі `.env`.

---

## 📁 Структура Docker-сервісів

| Сервіс           | Контейнер       | Опис                              |
| ---------------- | --------------- | --------------------------------- |
| **strapi-db**    | `crypto-db`     | База даних PostgreSQL             |
| **strapi-redis** | `crypto-redis`  | Кешування даних Redis             |
| **strapi**       | `crypto-strapi` | Основний додаток Strapi (Node.js) |

---

_Інструкція актуальна станом на лютий 2026 року._ -->
