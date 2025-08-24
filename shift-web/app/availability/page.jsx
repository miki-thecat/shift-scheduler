"use client";
import { useState } from "react";
const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

const empty = () => {
  const today = new Date().toISOString().slice(0, 10);
  return { date: today, start_time: "09:00", end_time: "13:00", status: "can", note: "" };
};

export default function AvailabilityPage() {
  const [lineUserId, setLineUserId] = useState("dev-user");
  const [rows, setRows] = useState([empty()]);
  const [msg, setMsg] = useState("");
  const [posting, setPosting] = useState(false);

  const setVal = (i, k, v) => setRows(rs => rs.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const add = () => setRows(rs => [...rs, empty()]);
  const del = (i) => setRows(rs => rs.filter((_, idx) => idx !== i));

  const submit = async () => {
    setPosting(true); setMsg("");
    try {
      for (const r of rows) {
        if (!r.date || !r.start_time || !r.end_time) throw new Error("日付・開始・終了は必須です");
        if (r.end_time <= r.start_time) throw new Error("終了は開始より後にしてください");
      }
      const res = await fetch(`${API}/api/availabilities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line_user_id: lineUserId, items: rows })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "送信に失敗しました");
      setMsg("送信しました");
    } catch (e) { setMsg(`エラー：${e.message}`); }
    finally { setPosting(false); }
  };

  return (
    <main className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">希望シフトのまとめ提出</h1>

      <div>
        <label className="block text-sm mb-1">line_user_id（開発中は dev-user でOK）</label>
        <input className="border rounded p-2 w-full" value={lineUserId} onChange={e => setLineUserId(e.target.value)} />
      </div>

      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="border rounded p-3">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div>
                <label className="block text-sm mb-1">日付</label>
                <input type="date" className="border rounded p-2 w-full" value={r.date} onChange={e => setVal(i, "date", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">開始</label>
                <input type="time" className="border rounded p-2 w-full" value={r.start_time} onChange={e => setVal(i, "start_time", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">終了</label>
                <input type="time" className="border rounded p-2 w-full" value={r.end_time} onChange={e => setVal(i, "end_time", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">希望度</label>
                <select className="border rounded p-2 w-full" value={r.status} onChange={e => setVal(i, "status", e.target.value)}>
                  <option value="prefer">prefer（第1希望）</option>
                  <option value="can">can（可能）</option>
                  <option value="cannot">cannot（不可）</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">メモ</label>
                <input className="border rounded p-2 w-full" value={r.note} onChange={e => setVal(i, "note", e.target.value)} />
              </div>
            </div>
            <div className="text-right mt-2">
              <button className="px-3 py-1 border rounded" onClick={() => del(i)}>削除</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="px-4 py-2 border rounded" onClick={add}>行を追加</button>
        <button className="px-4 py-2 border rounded bg-black text-white disabled:opacity-50" disabled={posting} onClick={submit}>
          {posting ? "送信中..." : "まとめて送信"}
        </button>
      </div>

      {msg && <p className="text-sm text-gray-700">{msg}</p>}
    </main>
  );
}
