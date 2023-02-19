const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Create a connection to the SQLite database
const db = new sqlite3.Database('./data/database.db');

// Define the directory path for the roles data files
const rolesDirectory = path.join(__dirname, 'data', 'roles');

// Iterate through the files in the roles directory
fs.readdir(rolesDirectory, (err, files) => {
  if (err) {
    console.error(err);
  } else {
    files.forEach(file => {
      const filePath = path.join(rolesDirectory, file);

      // Load the contents of the file as a JSON object
      const data = fs.readFileSync(filePath, 'utf-8');
      const role = JSON.parse(data);

      // Check if the role already exists in the database
      const query = `SELECT id FROM role WHERE name = '${role.Role}'`;
      db.get(query, (err, row) => {
        if (err) {
          console.error(err);
        } else if (row === undefined) {
          // Role doesn't exist in database, so insert it
          const insertQuery = 'INSERT INTO role (name, description) VALUES (?, ?)';
          db.run(insertQuery, [role.Role, role.Description], (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`Role ${role.Role} added to database.`);
              insertRequiredSkills(role);
              insertRecommendedSkills(role);
            }
          });
        } else {
          // Role already exists in database, so skip it
          console.log(`Role ${role.Role} already exists in database.`);
          insertRequiredSkills(role);
          insertRecommendedSkills(role);
        }
      });
    });
  }
});

// Helper function to insert required skills for a role
function insertRequiredSkills(role) {
  role.Skills.Required.forEach(skill => {
    // Check if the skill already exists in the database
    const query = `SELECT id FROM skill WHERE name = '${skill.SkillName}'`;
    db.get(query, (err, row) => {
      if (err) {
        console.error(err);
      } else if (row === undefined) {
        // Skill doesn't exist in database, so insert it
        const insertQuery = 'INSERT INTO skill (name, description) VALUES (?, ?)';
        db.run(insertQuery, [skill.SkillName, skill.SkillDescription], (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Skill ${skill.SkillName} added to database.`);
            addRoleSkillLink(role.Role, skill.SkillName, 'required', skill.SkillLevel);
          }
        });
      } else {
        // Skill already exists in database, so skip it
        console.log(`Skill ${skill.SkillName} already exists in database.`);
        addRoleSkillLink(role.Role, skill.SkillName, 'required', skill.SkillLevel);
      }
    });
  });
}

// Helper function to insert recommended skills for a role
function insertRecommendedSkills(role) {
  role.Skills.Recommended.forEach(skill => {
    // Check if the skill already exists in the database
    const query = `SELECT id FROM skill WHERE name = '${skill.SkillName}'`;
    db.get(query, (err, row) => {
      if (err) {
        console.error(err);
      } else if (row === undefined) {
        // Skill doesn't exist in database, so insert it
        const insertQuery = `INSERT INTO skill (name, description) VALUES (?,?)`;
        db.run(insertQuery, [skill.skillName, skill.skillDescription], (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Skill ${skill.SkillName} added to database.`);
            addRoleSkillLink(role.Role, skill.SkillName, 'recommended', skill.SkillLevel);
          }
        });
      } else {
        // Skill already exists in database, so skip it
        console.log(`Skill ${skill.SkillName} already exists in database.`);
        addRoleSkillLink(role.Role, skill.SkillName, 'recommended', skill.SkillLevel);
      }
    });
  });
}

// Helper function to add a link between a role and a skill in the role_skill table
function addRoleSkillLink(roleName, skillName, status, level) {
  // Get the IDs of the role and skill from the database
  const roleQuery = `SELECT id FROM role WHERE name = '${roleName}'`;
  db.get(roleQuery, (err, roleRow) => {
    if (err) {
      console.error(err);
    } else if (roleRow === undefined) {
        console.error(`Role ${roleName} not found in database.`);
    } else {
      const skillQuery = `SELECT id FROM skill WHERE name = '${skillName}'`;
      db.get(skillQuery, (err, skillRow) => {
        if (err) {
          console.error(err);
        } else if (skillRow === undefined) {
          console.error(`Skill ${skillName} not found in database.`);
        } else {
          // Add a row to the role_skill table
          const insertQuery = `INSERT INTO role_skill (role_id, skill_id, status, level) VALUES (${roleRow.id}, ${skillRow.id}, '${status}', '${level}')`;
          db.run(insertQuery, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`Role ${roleName} linked to skill ${skillName} in role_skill table.`);
            }
          });
        }
      });
    }
  });
}