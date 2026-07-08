-- Subwise — esquema MySQL 8 (utf8mb4). Se aplica a la BD `subwise` (local y acmsy).
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(120)  NOT NULL,
  email         VARCHAR(190)  NOT NULL,
  password_hash VARCHAR(255)  NULL,
  google_id     VARCHAR(255)  NULL,
  photo         MEDIUMTEXT    NULL,
  initials      VARCHAR(8)    NOT NULL DEFAULT '',
  moneda        VARCHAR(8)    NOT NULL DEFAULT 'COP',
  notify_days   INT           NOT NULL DEFAULT 3,
  email_alerts  TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subscriptions (
  id           VARCHAR(32)  NOT NULL,
  user_id      INT UNSIGNED NOT NULL,
  name         VARCHAR(160) NOT NULL,
  initials     VARCHAR(8)   NOT NULL DEFAULT '',
  tint         VARCHAR(16)  NOT NULL DEFAULT '#3C8C5A',
  category     VARCHAR(40)  NOT NULL DEFAULT 'compras',
  amount       BIGINT       NOT NULL,
  currency     VARCHAR(8)   NOT NULL DEFAULT 'COP',
  cycle        ENUM('mensual','anual') NOT NULL DEFAULT 'mensual',
  next_charge  DATE         NULL,
  method       VARCHAR(80)  NULL,
  status       ENUM('activa','cancelada','prueba') NOT NULL DEFAULT 'activa',
  trial_days   INT          NULL,
  trial_ends   DATE         NULL,
  started      DATE         NULL,
  canceled     DATE         NULL,
  notes        VARCHAR(500) NULL,
  reminded_on  DATE         NULL,   -- último día que se avisó su renovación (push)
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_subs_user (user_id),
  CONSTRAINT fk_subs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Historial de precios de cada suscripción.
CREATE TABLE IF NOT EXISTS sub_history (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sub_id      VARCHAR(32)  NOT NULL,
  occurred_on DATE         NOT NULL,
  amount      BIGINT       NOT NULL,
  PRIMARY KEY (id),
  KEY idx_hist_sub (sub_id),
  CONSTRAINT fk_hist_sub FOREIGN KEY (sub_id) REFERENCES subscriptions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categorías por usuario (arrancan con un set por defecto al registrarse).
CREATE TABLE IF NOT EXISTS categories (
  user_id INT UNSIGNED NOT NULL,
  id      VARCHAR(60)  NOT NULL,
  label   VARCHAR(80)  NOT NULL,
  PRIMARY KEY (user_id, id),
  CONSTRAINT fk_cat_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Métodos de pago por usuario.
CREATE TABLE IF NOT EXISTS payment_methods (
  id      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  label   VARCHAR(80)  NOT NULL,
  PRIMARY KEY (id),
  KEY idx_pm_user (user_id),
  CONSTRAINT fk_pm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
