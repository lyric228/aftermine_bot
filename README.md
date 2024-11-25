

**Aftermine Bot**
================

[![Stars](https://img.shields.io/github/stars/lyric228/aftermine_bot?style=social)](https://github.com/lyric228/aftermine_bot/stargazers)

[![Forks](https://img.shields.io/github/forks/lyric228/aftermine_bot?style=social)](https://github.com/lyric228/aftermine_bot/network/members)

[![Watchers](https://img.shields.io/github/watchers/lyric228/aftermine_bot?style=social)](https://github.com/lyric228/aftermine_bot/watchers)

[![Issues](https://img.shields.io/github/issues/lyric228/aftermine_bot?style=social)](https://github.com/lyric228/aftermine_bot/issues)

**Описание**
------------

Aftermine Bot - это серверный проект, написанный на Node.js, который предоставляет функционал для взаимодействия с Minecraft ботом. Проект состоит из двух основных файлов: `index.mjs` и `cfg.mjs`.

**Статистика**
-------------

* **Звёзды:** 1
* **Просмотры:** 1
* **Форки:** 0
* **Вопросы:** 0

**Технологии**
-------------

* **Node.js:** ^22.11.0
* **Mineflayer:** ^4.23.0
* **Telegram Bot API:** ^0.66.0

**Функционал**
-------------

* Взаимодействие с Minecraft ботом через Mineflayer
* Взаимодействие с Telegram API для отправки сообщений
* Конфигурация через файл `cfg.mjs`

**Установка**
-------------

1. Клонировать репозиторий: `git clone https://github.com/lyric228/aftermine_bot.git`
2. Установить зависимости: `npm update`
3. Запустить сервер: `npm start`

**Конфигурация**
--------------

Конфигурация проекта осуществляется через файл `cfg.mjs`. В этом файле можно указать следующие параметры:

* `token`: Токен Telegram бота
* `chatId`: ID чата, в котором будет отправляться информация
* `minecraftServer`: Адрес Minecraft сервера

**Пример конфигурации**
---------------------

```javascript
export let admins = [
  "ADMIN1",
  "ADMIN2 ",
  ...
];
export const AiToken = "YOUR_HUGGINGFACE_TOKEN";
```

**Лицензия**
------------

Проект распространяется под лицензией MIT.

**Автор**
---------

* **lyric228:** [https://github.com/lyric228](https://github.com/lyric228)

**Благодарности**
----------------

* **Mineflayer:** [https://github.com/PrismarineJS/mineflayer](https://github.com/PrismarineJS/mineflayer)
* **Telegram Bot API:** [https://core.telegram.org/bots/api](https://core.telegram.org/bots/api)