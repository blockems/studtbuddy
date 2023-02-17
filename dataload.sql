CREATE TABLE PROFILE (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

INSERT INTO PROFILE (id, name, description)
VALUES
  (1, 'Scrum Master', 'A Scrum Master is responsible for ensuring that the Scrum framework is implemented correctly and facilitating the Scrum process.'),
  (2, 'Release Train Engineer (RTE)', 'A Release Train Engineer is responsible for ensuring the success of the Agile Release Train (ART) by facilitating program-level execution and continuous improvement.'),
  (3, 'SAFe Release Train Engineer (RTE)', 'A SAFe Release Train Engineer is responsible for ensuring the success of the Scaled Agile Framework (SAFe) by facilitating program-level execution and continuous improvement.');

CREATE TABLE SKILL (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

INSERT INTO SKILL (id, name, description)
VALUES
  (1, 'Strong understanding of Scrum', 'A Scrum Master should have a strong understanding of Scrum methodology and be able to apply it effectively in practice.'),
  (2, 'Communication skills', 'The Scrum Master is responsible for facilitating communication and collaboration among team members and stakeholders. Therefore, strong communication skills are essential.'),
  (3, 'Leadership skills', 'The Scrum Master is a leadership role in Scrum methodology. Therefore, strong leadership skills are essential, including the ability to lead by example, motivate team members, and encourage self-organizing teams.'),
  (4, 'Facilitation skills', 'The Scrum Master is responsible for facilitating the Scrum process, including Scrum meetings and events. Therefore, strong facilitation skills are essential, including the ability to manage group dynamics, resolve conflicts, and keep the team focused on the task at hand.'),
  (5, 'Problem-solving skills', 'The Scrum Master should have strong problem-solving skills, including the ability to identify and resolve issues that arise during the Scrum process.'),
  (6, 'Technical knowledge', 'While a Scrum Master does not need to be a technical expert, they should have a basic understanding of the technical aspects of the project.'),
  (7, 'Continuous learning', 'Finally, a Scrum Master should have a strong desire for continuous learning and improvement. This includes staying up-to-date with the latest developments in Scrum methodology and continuously improving their skills.'),
  (8, 'Agile methodology', 'An RTE should have a strong understanding of Agile methodology and its implementation at the program level. This includes a knowledge of the Agile Manifesto, Scrum, and other Agile frameworks.'),
  (9, 'Program management', 'An RTE should have a solid understanding of program management, including the ability to manage dependencies, prioritize work, and track progress.'),
  (10, 'Communication skills', 'An RTE should have strong communication skills, including the ability to communicate effectively with team members, stakeholders, and senior management.'),
  (11, 'Technical knowledge', 'An RTE should have a basic understanding of the technical aspects of the program, including software development, testing, and release management.'),
  (12, 'Continuous improvement', 'An RTE should have a strong desire for continuous improvement and be able to drive continuous improvement in the program by identifying and resolving issues and implementing new practices and processes.'),
  (13, 'SAFe methodology', 'An SAFe RTE should have a strong understanding of the SAFe methodology and its implementation at the program level. This includes a knowledge of SAFe principles, practices, and roles.'),
  (14, 'SAFe certification', 'An SAFe RTE should have a SAFe RTE certification to demonstrate their knowledge and understanding of the SAFe methodology and the RTE role.');

CREATE TABLE PROFILE_SKILL (
profile_id INT NOT NULL,
skill_id INT NOT NULL,
PRIMARY KEY (profile_id, skill_id),
FOREIGN KEY (profile_id) REFERENCES PROFILE(id),
FOREIGN KEY (skill_id) REFERENCES SKILL(id)
);

INSERT INTO PROFILE_SKILL (profile_id, skill_id)
VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7),
(2, 1), (2, 3), (2, 4), (2, 9), (2, 10), (2, 11), (2, 12),
(3, 8), (3, 9), (3, 10), (3, 11), (3, 12), (3, 13), (3, 14);
