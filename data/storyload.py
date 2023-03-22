import json
import sqlite3

def insert_story(cursor, story_data, parent_id=None, story_type=None):
        
    print(story_type)
    print(story_data['Number'])
    print(story_data['Description'])
    print(story_data)

    cursor.execute("""
        INSERT INTO stories (order_no, parent_id, story_type, summary, estimate)
        VALUES (?, ?, ?, ?, ?)
    """, (story_data['Number'], parent_id, story_type, story_data['Description'], story_data['Estimate']))

    story_id = cursor.lastrowid

    if 'Epics' in story_data:
        for epic in story_data['Epics']:
            epic_id = insert_story(cursor, epic, parent_id=story_id, story_type='Epic')
            if 'Features' in epic:
                for feature in epic['Features']:
                    feature_id = insert_story(cursor, feature, parent_id=epic_id, story_type='Feature')
                    if 'Stories' in feature:
                        for story in feature['Stories']:
                            insert_story(cursor, story, parent_id=feature_id, story_type='Story')
    return story_id

def main():
    with open('./stories/stories.json', 'r') as file:
        data = json.load(file)

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    for initiative in data['Initiatives']:
        insert_story(cursor, initiative, 0, 'Initiative')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    main()
