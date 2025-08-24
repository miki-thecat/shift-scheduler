"use client";
import { useEffect, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function Manager() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0,7));
  const [deadline, setDeadline] = useState("");
  const [periods, setPeriods] = useState([]);
  const [periodId, setPeriodId] = useState("");
  const [needed, setNeeded] = useState(2);
  const [msg, setMsg] = useState("");

  const loadPeriods = async ()=>{
    const r = await fetch(`${API}/api/periods`);
    const j = await r.json(); if (j.ok) setPeriods(j.items);
  };

  useEffect(()=>{ loadPeriods(); }, []);

  const createPeriod = async ()=>{
    setMsg("");
    const r = await fetch(`${API}/api/periods`, {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ month, name: `${month} シフト`, deadline: deadline || null })
    });
    const j = await r.json();
    if (j.ok) { setMsg("期間を作成/更新しました"); await loadPeriods(); setPeriodId(j.period.id); }
    else setMsg(j.error || "失敗");
  };

  const genSlots = async ()=>{
    if (!periodId) return setMsg("期間を選択してください");
    const r = await fetch(`${API}/api/slots/generate?period_id=${periodId}&needed=${needed}`, { method: "POST" });
    const j = await r.json(); setMsg(j.ok ? `スロット生成: ${j.generated}` : j.error);
  };

  const assignAI = async ()=>{
    if (!periodId) return setMsg("期間を選択してください");
    const r = await fetch(`${API}/api/assign/greedy?period_id=${periodId}`, { method: "POST" });
    const j = await r.json(); setMsg(j.ok ? `AI割当: ${j.created}` : j.error);
  };

  const exportExcel = ()=>{
    if (!periodId) return setMsg("期間を選択してください");
    window.open(`${API}/api/export/excel?period_id=${periodId}`, "_blank");
  };

  return (
    <main className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">店長ページ</h1>

      <section className="border rounded p-3 space-y-2">
        <h2 className="font-semibold">期間作成</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm mb-1">月 (YYYY-MM)</label>
            <input type="month" className="border rounded p-2 w-full" value={month} onChange={e=>setMonth(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">締切 (任意)</label>
            <input type="date" className="border rounded p-2 w-full" value={deadline} onChange={e=>setDeadline(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button className="px-4 py-2 border rounded bg-black text-white" onClick={createPeriod}>作成/更新</button>
          </div>
        </div>
      </section>

      <section className="border rounded p-3 space-y-2">
        <h2 className="font-semibold">対象期間の操作</h2>
        <div className="flex gap-2 items-center">
          <select className="border rounded p-2" value={periodId} onChange={e=>setPeriodId(e.target.value)}>
            <option value="">-- 期間を選択 --</option>
            {periods.map(p=><option key={p.id} value={p.id}>{p.name || p.month}</option>)}
          </select>
          <input type="number" className="border rounded p-2 w-24" value={needed} onChange={e=>setNeeded(+e.target.value)} />
          <span className="text-sm">必要人数/枠</span>
          <button className="px-3 py-2 border rounded" onClick={genSlots}>スロット生成</button>
          <button className="px-3 py-2 border rounded" onClick={assignAI}>AI割当</button>
          <button className="px-3 py-2 border rounded" onClick={exportExcel}>Excel出力</button>
        </div>
      </section>

      {msg && <p className="text-sm text-gray-700">{msg}</p>}
    </main>
  );
}
