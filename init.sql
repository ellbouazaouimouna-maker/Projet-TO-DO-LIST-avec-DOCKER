CREATE TABLE IF NOT EXISTS taches (
    id       SERIAL PRIMARY KEY,
    titre    VARCHAR(255) NOT NULL,
    fait     BOOLEAN DEFAULT FALSE,
    cree_le  TIMESTAMP DEFAULT NOW()
);

INSERT INTO taches (titre) VALUES
    ('Apprendre Docker'),
    ('Écrire le Dockerfile'),
    ('Tester l''application');