--select * from stories

--SELECT s.*, u.id as user_id, u.first_name, u.last_name FROM stories s LEFT JOIN users u ON s.assigned_id = u.id order by order_no

-- Add a new column of type VARCHAR(20)
--ALTER TABLE users ADD COLUMN usertype int default 2;

--ALTER TABLE users ADD COLUMN email text not null

-- Drop the old column
--ALTER TABLE stories DROP COLUMN order_no;

-- Rename the new column to the original name
--ALTER TABLE stories RENAME COLUMN order_id TO order_no;

--delete FROM stories

--update stories set parent_id = 0 where parent_id = -1

--drop table users

--select * from users

SELECT r.*
    FROM roles r
    INNER JOIN user_roles ru ON r.id = ru.role_id
    WHERE ru.user_id = 1 AND ru.enddate IS NULL
