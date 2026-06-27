from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_connection
from nlp import analyze_reviews, get_top_keywords, is_fake

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Smart Cart Analyst API is running"})

@app.route('/reviews', methods=['GET'])
def get_reviews():
    product = request.args.get('product', '')

    if not product:
        return jsonify({"message": "product parameter is required"}), 400

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT product_id, review_text, rating, summary
        FROM reviews
        WHERE product_id LIKE ? OR summary LIKE ?
        LIMIT 50
    ''', (f'%{product}%', f'%{product}%'))

    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return jsonify({"error": f"No reviews found for {product}"}), 404

    reviews = []
    for row in rows:
        reviews.append({
            "product_id": row["product_id"],
            "review_text": row["review_text"],
            "rating": row["rating"],
            "summary": row["summary"]
        })
    return jsonify({
        "product": product,
        "total_reviews": len(reviews),
        "reviews": reviews
    })

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    product = data.get('product', '')

    if not product:
        return jsonify({"error": "product is required"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT review_text, rating, summary
        FROM reviews
        WHERE product_id LIKE ? OR summary LIKE ?
        LIMIT 100
    ''', (f'%{product}%', f'%{product}%'))

    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return jsonify({"error": f"No reviews found for {product}"}), 404

    reviews_text = [row["review_text"] for row in rows]
    ratings = [row["rating"] for row in rows]

    sentiment = analyze_reviews(reviews_text)
    keywords = get_top_keywords(reviews_text)
    fake_count = sum(1 for i, r in enumerate(reviews_text) if is_fake(r, ratings[i]))

    return jsonify({
        "product": product,
        "total_reviews": len(rows),
        "sentiment": sentiment,
        "keywords": keywords,
        "fake_pct": round((fake_count / len(rows)) * 100, 2)
    })

if __name__ == '__main__':
    app.run(debug=True)