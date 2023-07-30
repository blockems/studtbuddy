/*
CREATE TABLE results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    no_questions INTEGER NOT NULL,
    no_correct INTEGER NOT NULL,
    score REAL NOT NULL
);
*/

/*
SELECT * 
  FROM Questions q, 
  skills s, 
  roles_skills rs 
  where rs.skill_id = s.id 
  and q.skill_id = s.id 
  and rs.role_id = 37
  and rs.importance = 'Required';
*/

/*
SELECT * 
  FROM Questions q, 
  skills s,
    roles_skills rs
  where q.skill_id = s.id 
  and s.id = rs.skill_id
  and q.role_id = 37
  and rs.importance = 'Required';
*/

select * from results

--SELECT name FROM sqlite_master WHERE type='table';