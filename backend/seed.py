import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import re
import sqlite3

def clean_text(text):
    text = re.sub(r'<.*?>','',str(text))
    text = re.sub(r'&\w+;','',text)
    text = text.strip()
    return text

def seed_database():
    print("Reading csv....")
    df = pd.read_csv('Reviews.csv')
    print(f'Raw Data: {len(df)}')

    #duplicates
    df = df.drop_duplicates(subset=['Text'])

    #empty rows
    df = df.drop_duplicates(subset=['Text','Score'])

    df['Text'] = df['Text'].apply(clean_text)

    #reviews less than 10 words
    df = df[df['Text'].str.split().str.len()>=10]

    
    df = df.head(568454)
    df = df[['ProductId', 'Text', 'Score', 'Summary']]
    df = df.rename(columns={
        'ProductId': 'product_id',
        'Text': 'review_text',
        'Score': 'rating',
        'Summary': 'summary'
    })

    print(f"Clean rows to load: {len(df)}")

    conn = sqlite3.connect('smartcart.db')
    df.to_sql('reviews', conn, if_exists='replace', index=False)
    conn.close()

    print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()



    