"use client";
import { useState } from "react";
export default function AvailabilityPage() {
  const [ok, setOk] = useState(false);
  async function submit() {
    const payload = {
      line_user_id: "dev-user",
      items: [{ date: "2025-08-15", start: "2025-08-15T09:00:00", end: "2025-08-15T13:00:00", status: "prefer" }]
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"}/api/availabilities`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    setOk(res.ok);
  }
  return (
    <main style={{ padding: 24 }}>
      <h1>シフト希望（開発）</h1>
      <button onClick={submit}>送信</button>
      {ok && <p>OK</p>}
    </main>
  );
}
