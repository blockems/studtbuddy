--CREATE TABLE SKILL_backup(id_backup INTEGER, name TEXT, description TEXT, PRIMARY KEY(id_backup));
--INSERT INTO SKILL_backup(id_backup, name, description) SELECT id, name, description FROM [SKILL];
--DROP TABLE [SKILL];
--CREATE TABLE [SKILL](id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar 255, description TEXT);
--INSERT INTO [ROLE](id, name, description) SELECT id_backup, name, description FROM ROLE_backup;
--DROP TABLE ROLE_backup;


--DELETE FROM ROLE_SKILL
--delete FROM ROLE WHERE name = 'Technical Business Analyst'

--ALTER TABLE SKILL MODIFY COLUMN id INTEGER PRIMARY KEY AUTOINCREMENT

--PRAGMA table_info(ROLES_SKILLS);

--ALTER TABLE Role_SKILL RENAME COLUMN role TO level;

--select * from ROLES_SKILLS

--select * from Roles

/*
SELECT *
FROM roles r
INNER JOIN roles_skills rs 
    ON r.id = rs.role_id 
    INNER JOIN skills s ON s.id = rs.skill_id;


SELECT r.name, r.description, rs.seniority, rs.importance, s.name as skillname, s.description as skilldescription,
case when rs.seniority = 'Competent' then 1
     when rs.seniority = 'Expert' then 2
     when rs.seniority = 'Lead' then 3
     else 0
end as seniorityorder
FROM roles r,
        roles_skills rs,
        skills s
WHERE r.id = rs.role_id and s.id = rs.skill_id
order by r.name asc, seniorityorder, rs.importance desc


SELECT r.name, rs.seniority, rs.importance, s.name as skillname, s.description as skilldescription
FROM roles r,
        roles_skills rs,
        skills s,
WHERE r.id = rs.role_id and s.id = rs.skill_id and skill_id = 245
order by r.name asc, rs.importance desc

*/

--select * from ROLES

--delete from skills;
--delete from roles;
--delete from roles_skills;

--TRUNCATE table ROLES;

--TRUNCATE table SKILLS;

select * from questions