import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

export default function App() {
  const [product, setProduct] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!product) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      const data = await res.json();
      if (res.status === 404) setError(data.error);
      else setResult(data);
    } catch {
      setError("Cannot connect to backend. Make sure Flask is running.");
    }
    setLoading(false);
  };

  const chartData = result ? [
    { name: "Positive", value: result.sentiment.positive_pct, color: "#10b981" },
    { name: "Neutral", value: result.sentiment.neutral_pct, color: "#f59e0b" },
    { name: "Negative", value: result.sentiment.negative_pct, color: "#ef4444" },
  ] : [];

  const getScoreColor = (score) => {
    if (score >= 0.5) return "#10b981";
    if (score >= 0) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#fff",
      padding: "40px 20px"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <div style={{ fontSize: "48px", marginBottom: "10px" }}>🛒</div>
        <h1 style={{
          fontSize: "42px",
          fontWeight: "800",
          background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 10px"
        }}>
          SmartCart Analyst
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "16px", margin: 0 }}>
          NLP-powered product review intelligence
        </p>
      </div>

      {/* Search */}
      <div style={{
        maxWidth: "650px",
        margin: "0 auto 50px",
        display: "flex",
        gap: "12px"
      }}>
        <input
          type="text"
          placeholder="Search product (e.g. dog food, coffee, tea...)"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{
            flex: 1,
            padding: "16px 20px",
            fontSize: "15px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.07)",
            color: "#fff",
            outline: "none",
            backdropFilter: "blur(10px)"
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "16px 32px",
            fontSize: "15px",
            fontWeight: "600",
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          {loading ? "Analyzing..." : "Analyze →"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          maxWidth: "650px",
          margin: "0 auto 30px",
          background: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "12px",
          padding: "16px 20px",
          color: "#fca5a5",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "16px" }}>
          ⏳ Running NLP analysis on reviews...
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* Product name */}
          <h2 style={{
            textAlign: "center",
            fontSize: "22px",
            color: "#e2e8f0",
            marginBottom: "30px",
            fontWeight: "400"
          }}>
            Results for: <span style={{ color: "#a78bfa", fontWeight: "700" }}>{result.product}</span>
            <span style={{ color: "#64748b", fontSize: "14px", marginLeft: "12px" }}>
              ({result.total_reviews} reviews analyzed)
            </span>
          </h2>

          {/* Summary Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "30px"
          }}>
            {[
              { label: "Sentiment Score", value: result.sentiment.average_score, suffix: "", color: getScoreColor(result.sentiment.average_score) },
              { label: "Positive Reviews", value: result.sentiment.positive_pct, suffix: "%", color: "#10b981" },
              { label: "Negative Reviews", value: result.sentiment.negative_pct, suffix: "%", color: "#ef4444" },
              { label: "Fake Reviews", value: result.fake_pct, suffix: "%", color: result.fake_pct > 30 ? "#ef4444" : "#10b981" },
            ].map((card) => (
              <div key={card.label} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "24px 16px",
                textAlign: "center",
                backdropFilter: "blur(10px)"
              }}>
                <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {card.label}
                </p>
                <p style={{ color: card.color, fontSize: "32px", fontWeight: "800", margin: 0 }}>
                  {card.value}{card.suffix}
                </p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "30px",
            marginBottom: "24px",
            backdropFilter: "blur(10px)"
          }}>
            <h3 style={{ color: "#e2e8f0", margin: "0 0 24px", fontSize: "18px" }}>
              📊 Sentiment Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ background: "#1e1b4b", border: "1px solid #4f46e5", borderRadius: "8px" }}
                  labelStyle={{ color: "#a78bfa" }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Keywords */}
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "30px",
            backdropFilter: "blur(10px)"
          }}>
            <h3 style={{ color: "#e2e8f0", margin: "0 0 20px", fontSize: "18px" }}>
              🔑 Top Keywords
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {result.keywords.map((word, i) => (
                <span key={i} style={{
                  background: "rgba(124,58,237,0.2)",
                  border: "1px solid rgba(124,58,237,0.4)",
                  color: "#a78bfa",
                  padding: "8px 18px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: "500"
                }}>
                  {word}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}