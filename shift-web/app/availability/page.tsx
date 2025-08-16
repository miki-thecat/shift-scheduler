"use client";
import { useState } from "react";

export default function AvailabilityPage() {
  // 入力欄の状態
  const [date, setDate] = useState("");
  const [start, setStart] = useState(""); // "09:00" 形式
  const [end, setEnd] = useState("");     // "13:00" 形式
  const [status, setStatus] = useState("prefer"); // prefer | can | cannot

  // 送信状態
  const [ok, setOk] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

  // 送信
  async function submit() {
    setOk(null);
    setMsg("");

    // --- 簡易チェック ---
    if (!date || !start || !end) {
      setOk(false);
      setMsg("日付・開始・終了のすべてを入力してください。");
      return;
    }
    if (start >= end) {
      setOk(false);
      setMsg("開始時刻は終了時刻より前にしてください。");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        line_user_id: "dev-user",
        items: [
          {
            date,                                // 例: "2025-08-15"
            start: `${date}T${start}:00`,        // 例: "2025-08-15T09:00:00"
            end:   `${date}T${end}:00`,          // 例: "2025-08-15T13:00:00"
            status,                              // "prefer" | "can" | "cannot"
          },
        ],
      };

      const res = await fetch(`${API_BASE}/api/availabilities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setOk(true);
        setMsg("OK（保存成功）");
        // 入力クリア（好みで）
        // setDate(""); setStart(""); setEnd(""); setStatus("prefer");
      } else {
        const err = await res.json().catch(() => ({}));
        setOk(false);
        setMsg(`保存失敗 ${res.status}${err?.error ? `: ${err.error}` : ""}`);
      }
    } catch (e) {
      setOk(false);
      setMsg("通信エラー: " + String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h1 style={{ marginBottom: 16 }}>シフト希望（開発）</h1>

      <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>日付</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>開始</span>
            <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span>終了</span>
            <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </label>
        </div>

        <label style={{ display: "grid", gap: 6 }}>
          <span>希望度</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="prefer">希望</option>
            <option value="can">入れる</option>
            <option value="cannot">入れない</option>
          </select>
        </label>
      </div>

      <button onClick={submit} disabled={loading} style={{ padding: "8px 16px" }}>
        {loading ? "送信中..." : "送信"}
      </button>

      {msg && (
        <p style={{ marginTop: 12, color: ok ? "green" : "crimson" }}>
          {msg}
        </p>
      )}
    </main>
  );
}
