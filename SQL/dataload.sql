/*
CREATE TABLE ROLES (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE SKILLS (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);



CREATE TABLE ROLES_SKILLS (
role_id INT NOT NULL,
skill_id INT NOT NULL,
seniority VARCHAR(255) NOT NULL,
importance VARCHAR(255) NOT NULL,
PRIMARY KEY (role_id, skill_id)
);

*/

CREATE TABLE Questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  skill_id INT NOT NULL,
  role_id INT NOT NULL,
  questions TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL
);


--select * from skills