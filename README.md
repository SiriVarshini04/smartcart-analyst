# 🛒 SmartCart Analyst

A full-stack NLP web application that analyzes Amazon product reviews to detect fake reviews, score sentiment, and extract top keywords — helping buyers make informed purchasing decisions in seconds.

## 🔗 Live Demo
- **Frontend:** https://smartcart-analyst.netlify.app/
- **Backend API:** https://smartcart-analyst.onrender.com

## 🖼️ Screenshots
![SmartCart Analyst Dashboard](screenshot.png)

## 🚀 Features
- **Sentiment Analysis** — scores product reviews from -1 (negative) to +1 (positive) using VADER NLP
- **Fake Review Detection** — flags suspicious reviews based on length and rating patterns
- **Keyword Extraction** — surfaces top 10 keywords from reviews using TF-IDF algorithm
- **Product Search** — search by product name or Amazon product ID
- **Visual Dashboard** — sentiment distribution bar chart with color-coded metrics

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Recharts, Vite |
| Backend | Python, Flask, Flask-CORS |
| NLP | NLTK VADER, Scikit-learn TF-IDF |
| Database | SQLite, Pandas |
| Deployment | Netlify (frontend), Render (backend) |

## 📊 Dataset
- **Source:** Amazon Fine Food Reviews (Kaggle)
- **Size:** 568,454 reviews (full dataset)
- **Coverage:** Food products on Amazon (1999–2012)
- **Cleaning:** Removed duplicates, HTML tags, empty rows, and reviews under 10 words

## ⚙️ How to Run Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
python database.py
python seed.py
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`
Frontend runs on `http://localhost:5173`

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | / | Health check |
| GET | /reviews?product=X | Get raw reviews for a product |
| POST | /analyze | Full NLP analysis for a product |

### Sample Request
```json
POST /analyze
{
  "product": "dog food"
}
```

### Sample Response
```json
{
  "product": "dog food",
  "total_reviews": 100,
  "sentiment": {
    "average_score": 0.64,
    "positive_pct": 86.0,
    "negative_pct": 11.0,
    "neutral_pct": 3.0
  },
  "keywords": ["quality", "food", "dog", "taste", "price"],
  "fake_pct": 1.0
}
```

## 🧠 How It Works
1. User searches a product name or Amazon product ID
2. Flask fetches matching reviews from SQLite database
3. VADER NLP scores each review's sentiment (-1 to +1)
4. TF-IDF extracts top 10 keywords across all reviews
5. Rule-based logic flags short or suspicious reviews as fake
6. React frontend displays results with interactive chart and metrics

## ⚠️ Known Limitations

| Limitation | Reason | Future Fix |
|---|---|---|
| Only food products | Dataset is Amazon Fine Food Reviews only | Integrate live API like SerpAPI |
| Data is from 1999–2012 | Kaggle dataset is not real-time | Scrape or use paid reviews API |
| Fake detection is rule-based | No ML model trained for fake reviews | Train a classifier on labeled data |
| SQLite for storage | Not scalable for production traffic | Migrate to PostgreSQL or MySQL |
| VADER limitations | Struggles with sarcasm and slang | Replace with fine-tuned BERT model |
| No user authentication | Single shared database | Add JWT auth for personalized history |

## 🔮 Future Improvements
- Integrate SerpAPI for live Amazon review fetching
- Replace VADER with a fine-tuned BERT sentiment model
- Add product comparison mode (side-by-side analysis)
- Train a proper fake review classifier using labeled data
- Migrate backend to PostgreSQL for production scalability
- Add review export to CSV/PDF

## 👩‍💻 Author
**Siri Varshini**
- GitHub: [@SiriVarshini04](https://github.com/SiriVarshini04)
- LinkedIn: [your-linkedin-url]

## 📄 License
MIT License
