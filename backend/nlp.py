import nltk

# Download VADER lexicon if it is not available
nltk.download("vader_lexicon")

from nltk.sentiment.vader import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

sia = SentimentIntensityAnalyzer()

def get_sentiment(text):
    scores = sia.polarity_scores(text)
    return scores['compound']

def analyze_reviews(reviews_list):
    positive = 0
    negative = 0
    neutral = 0
    total = len(reviews_list)
    scores = []

    for review in reviews_list:
        score = get_sentiment(review)
        scores.append(score)
        if score > 0.2:
            positive += 1
        elif score < -0.2:
            negative += 1
        else:
            neutral += 1

    return {
        "average_score": round(sum(scores)/total, 2),
        "positive_pct": round((positive/total)*100, 2),
        "negative_pct": round((negative/total)*100, 2),
        "neutral_pct": round((neutral/total)*100, 2)
    }

def get_top_keywords(reviews_list, n=10):
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    tfidf_matrix = vectorizer.fit_transform(reviews_list)
    scores = np.array(tfidf_matrix.sum(axis=0)).flatten()
    indices = scores.argsort()[-n:][::-1]
    words = vectorizer.get_feature_names_out()
    return [words[i] for i in indices]

def is_fake(review_text, rating):
    word_count = len(review_text.split())
    if word_count < 10:
        return True
    if rating == 5 and word_count < 15:
        return True
    return False