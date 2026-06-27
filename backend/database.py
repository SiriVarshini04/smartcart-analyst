import sqlite3

def get_connection():
    conn = sqlite3.connect('smartcart.db')
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reviews(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT,
            review_text TEXT,
            rating INTEGER,
            summary TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analysis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT UNIQUE,
            sentiment_score REAL,
            positive_pct REAL,
            negative_pct REAL,
            neutral_pct REAL,
            fake_pct REAL,
            keywords TEXT
        )
    ''')

    conn.commit()
    conn.close()
    print("Tables Created Successfully")

if __name__ == '__main__':
    create_tables()
