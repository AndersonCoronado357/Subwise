-- Espejo para el panel de acmsy (lee auth_users/auth_logins) + Web Push.
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS auth_users (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  email          VARCHAR(255) UNIQUE NOT NULL,
  password_hash  VARCHAR(255),
  name           VARCHAR(255),
  google_id      VARCHAR(255),
  email_verified TINYINT(1) DEFAULT 0,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at  DATETIME NULL,
  last_seen_at   DATETIME NULL,
  login_count    INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS auth_logins (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  method     VARCHAR(40),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_auth_logins_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id            VARCHAR(36)  NOT NULL,
  user_id       INT UNSIGNED NOT NULL,
  endpoint_hash CHAR(64)     NOT NULL,
  endpoint      TEXT         NOT NULL,
  p256dh        VARCHAR(255) NOT NULL,
  auth          VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_push_endpoint (endpoint_hash),
  KEY idx_push_user (user_id),
  CONSTRAINT fk_push_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
