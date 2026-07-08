-- Marca el día que ya se avisó la renovación de una suscripción (evita duplicados).
ALTER TABLE subscriptions ADD COLUMN reminded_on DATE NULL;
