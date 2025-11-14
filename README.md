# Competitive Crossword

The truest battle of wit. I am so crossword-pilled it's kind of silly.

## Run backend server

Handles files and parsing. Acts like a nice API!

```console
cd backend
php -S localhost:8000
```

## Run frontend locally
```
npm install
npm run dev
```

## MySQL database

Table schema 

CREATE TABLE `user_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `puzzle_id` int NOT NULL,
  `grid_state` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_updated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_puzzle` (`user_id`,`puzzle_id`)
)

```console
brew services start mysql
mysql -u crossword_user -p crossword_app_db
```

