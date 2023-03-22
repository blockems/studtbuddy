import csv
import sqlite3

# Open a connection to the database
conn = sqlite3.connect('../database.db')
c = conn.cursor()

# Read the CSV file
with open('stories.csv', newline='', encoding='utf-8-sig') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # Convert string values to integers
        print(row)

        parent_id = int(row['Parent']) -1
        order_no = row['Number']
        story_type = row['Level']
        summary = row['Description']
        estimate = int(row['Estimate'])
        
        # Insert the record into the stories table
        c.execute('INSERT INTO stories (parent_id, order_no, story_type, summary, estimate) VALUES (?, ?, ?, ?, ?)',
                  (parent_id, order_no, story_type, summary, estimate))
        
        # Get the ID of the added record
        record_id = c.lastrowid
        
        # Update the parent_id for the next level
        parent_id = record_id if story_type != 'Story' else parent_id
        
# Commit the changes and close the connection
conn.commit()
conn.close()
