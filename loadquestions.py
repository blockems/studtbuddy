import os
import json
import sqlite3

# Define the database connection and table name
conn = sqlite3.connect('./data/database.db')
table_name = 'Questions'

# Loop through all the JSON files in the directory
directory = './data/questions'
for filename in os.listdir(directory):
    if filename.endswith('.json'):
        # Load the JSON data from the file
        with open(os.path.join(directory, filename), 'r') as file:
            data = json.load(file)

            print(f"Loading {filename}...")
            print(f"Loading role {data['roleid']}...")
            print(f"Loading skills {data['skillid']}...")

        # Get the role_id and skill_id from the JSON data
        role_id = int(data['roleid'])
        skill_id = int(data['skillid'])
        
        # Loop through the questions in the JSON data and insert them into the database
        for question in data['questions']:
            options = json.dumps(question['options'])
            values = (skill_id, role_id, question['question'], options, question['correct_answer'], question['explanation'])
            query = f"INSERT INTO {table_name} (skill_id, role_id, questions, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?)"
            conn.execute(query, values)
        
        # Commit the changes to the database
        conn.commit()

# Close the database connection
conn.close()
