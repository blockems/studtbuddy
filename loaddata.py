import os
import json
import sqlite3

# Define the directory path for the JSON data files
directory_path = './data/roles'

# Create a connection to the SQLite database
conn = sqlite3.connect('./data/database.db')

# Define a function to insert or update a record in the roles_skills table
def upsert_role_skill_link(role_id, skill_id, seniority, importance):
    c = conn.cursor()
    c.execute("SELECT * FROM roles_skills WHERE role_id = ? AND skill_id = ? and seniority = ?", (role_id, skill_id, seniority))
    result = c.fetchone()
    if result:
        print ("found role_skill link for role ID {} and skill ID {} and seniority {}".format(role_id, skill_id, seniority));
    else:
        c.execute("INSERT INTO roles_skills (role_id, skill_id, seniority, importance) VALUES (?, ?, ?, ?)", (role_id, skill_id, seniority, importance))
        print ("Inserted role_skill link for role ID {} and skill ID {} and seniority = {}".format(role_id, skill_id,seniority));
    conn.commit()

# Iterate through the files in the directory
for filename in os.listdir(directory_path):
    if filename.endswith('.json'):
        filepath = os.path.join(directory_path, filename)
        print ("Processing {}".format(filename));

        # Load the contents of the file as a JSON object
        with open(filepath, 'r') as file:
            json_obj = json.load(file)
            
        # Get the role name from the JSON object
        role_name = json_obj['Role']
        print ("Processing Role {}".format(role_name));

        # Check if the role already exists in the database
        c = conn.cursor()
        c.execute("SELECT id FROM roles WHERE name = ?", (role_name,))
        result = c.fetchone()
        if result:
            # Role already exists in database, so get its ID
            role_id = result[0]
        else:
            # Role doesn't exist in database, so insert it and get its ID
            print ("Inserting Role {} desc {}".format(filename, json_obj['Description']));
            c.execute("INSERT INTO roles (name, description) VALUES (?, ?)", (role_name, json_obj['Description']))
            role_id = c.lastrowid
            conn.commit()

        # Insert or update the required skills for the role
        for skill in json_obj['Skills']['Required']:
            skill_name = skill['SkillName']
            skill_desc = skill['SkillDescription']
            skill_level = skill['SkillLevel']

            # Check if the skill already exists in the database
            c.execute("SELECT id FROM skills WHERE name = ?", (skill_name,))
            result = c.fetchone()
            if result:
                # Skill already exists in database, so get its ID
                skill_id = result[0]
            else:
                # Skill doesn't exist in database, so insert it and get its ID
                c.execute("INSERT INTO skills (name, description) VALUES (?, ?)", (skill_name, skill_desc))
                skill_id = c.lastrowid
                conn.commit()

            # Insert or update the role_skill link for the skill
            upsert_role_skill_link(role_id, skill_id, skill_level, 'Required')

        # Insert or update the recommended skills for the role
        for skill in json_obj['Skills']['Recommended']:
            skill_name = skill['SkillName']
            skill_desc = skill['SkillDescription']
            skill_level = skill['SkillLevel']

            # Check if the skill already exists in the database
            c.execute("SELECT id FROM skills WHERE name = ?", (skill_name,))
            result = c.fetchone()
            if result:
                # Skill already exists in database, so get its ID
                skill_id = result[0]
            else:
                # Skill doesn't exist in database, so insert it and get its ID
                c.execute("INSERT INTO skills (name, description) VALUES (?, ?)", (skill_name, skill_desc))
                skill_id = c.lastrowid
                conn.commit()

            # Insert or update the role_skill link for the skill
            upsert_role_skill_link(role_id, skill_id, skill_level, 'Recommended')
