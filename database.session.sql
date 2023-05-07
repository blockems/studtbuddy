/*
SELECT r.*, s.skill_name
FROM roles r
INNER JOIN user_roles ru ON r.id = ru.role_id
LEFT JOIN skills s ON r.skill_id = s.id
WHERE ru.user_id = ? AND ru.enddate IS NULL
*/

--SELECT name FROM sqlite_master WHERE type='table'

/*
SELECT r.name, r.description, rs.seniority, rs.importance, s.name as skillname, s.description as skilldescription, s.id as skill_id, r.id as role_id,
    case when rs.seniority = 'Competent' then 1 when rs.seniority = 'Expert' then 2 when rs.seniority = 'Lead' then 3 else 0 end as seniorityorder
    FROM roles r, roles_skills rs, skills s, user_roles ru
    WHERE r.id = rs.role_id and s.id = rs.skill_id and r.id = ru.role_id and ru.user_id = 1 and ru.enddate is null
    order by r.name asc, seniorityorder, rs.importance desc
*/

/*
SELECT *
                       FROM roles r
                       INNER JOIN user_roles ru ON r.id = ru.role_id
                       WHERE ru.user_id = 1 AND ru.enddate IS NULL

*/


SELECT rs.role_id, s.id as skill_id, s.name as skillname, rs.seniority, rs.importance, s.description as skilldescription,
    case when rs.seniority = 'Competent' then 1 when rs.seniority = 'Expert' then 2 when rs.seniority = 'Lead' then 3 else 0 end as seniorityorder
    FROM roles_skills rs, skills s
    WHERE s.id = rs.skill_id and rs.role_id = 39
    order by seniorityorder, rs.importance desc


    --select * from roles_skills