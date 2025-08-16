"use client";
import { useState } from "react";

export default function AvailabilityPage() {
  const [ok, setOk] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

  async function submit() {
    setLoading(true);
    setOk(null);
    try {
      const payload = {
        line_user_id: "dev-user",
        items: [
          {
            date: "2025-08-15",
            start: "2025-08-15T09:00:00",
            end: "2025-08-15T13:00:00",
            status: "prefer",
          },
        ],
      };
      const res = await fetch(`${API_BASE}/api/availabilities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setOk(res.ok);
      console.log("API status:", res.status);
    } catch (e) {
      console.error(e);
      setOk(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>シフト希望（開発）</h1>
      <button onClick={submit} disabled={loading}>
        {loading ? "送信中..." : "送信"}
      </button>
      {ok === true && <p style={{ color: "green" }}>OK（保存成功）</p>}
      {ok === false && <p style={{ color: "crimson" }}>NG（失敗）</p>}
    </main>
  );
}
