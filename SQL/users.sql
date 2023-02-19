CREATE TABLE USER (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

INSERT INTO USER (id, name, description)
VALUES
  (1, 'Bruce Lock', 'Me'),
  (2, 'Rando', 'Random');