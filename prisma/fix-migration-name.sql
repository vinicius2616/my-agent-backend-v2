-- Alinha histórico: migration aplicada no DB tinha nome antigo (pasta foi renomeada).
UPDATE _prisma_migrations
SET migration_name = '20260225100000_rename_finances_transactions_constraints'
WHERE migration_name = '20260224215513';
