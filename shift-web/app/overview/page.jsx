"use client";
import { useEffect, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function Overview() {
  const [periods, setPeriods] = useState([]);
  const [periodId, setPeriodId] = useState("");
  const [data, setData] = useState(null);

  useEffect(()=>{ (async ()=>{
    const r = await fetch(`${API}/api/periods`);
    const j = await r.json();
    if (j.ok) { setPeriods(j.items); if (j.items[0]) setPeriodId(j.items[0].id); }
  })(); }, []);

  useEffect(()=>{ if (!periodId) return;
    (async ()=>{
      const r = await fetch(`${API}/api/overview?period_id=${periodId}`);
      const j = await r.json();
      if (j.ok) setData(j);
    })();
  }, [periodId]);

  return (
    <main className="p-4 max-w-[95vw] mx-auto">
      <h1 className="text-xl font-bold mb-3">他メンバーの希望一覧</h1>

      <div className="flex gap-2 items-center mb-4">
        <span className="text-sm">期間:</span>
        <select className="border rounded p-2" value={periodId} onChange={e=>setPeriodId(e.target.value)}>
          {periods.map(p=><option key={p.id} value={p.id}>{p.name || p.month}</option>)}
        </select>
      </div>

      {!data ? <p>読み込み中...</p> : (
        <div className="space-y-2 overflow-auto">
          <div className="text-sm text-gray-600">○=prefer △=can ×=cannot</div>
          <table className="min-w-[800px] border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">人＼日付</th>
                {data.days.map((d,i)=><th key={i} className="border p-2">{d.slice(5)}</th>)}
              </tr>
              <tr>
                <th className="border p-2 text-left">必要人数</th>
                {data.needs.map((n,i)=><th key={i} className="border p-2 text-center">{n}</th>)}
              </tr>
              <tr>
                <th className="border p-2 text-left">充足率</th>
                {data.rates.map((r,i)=><th key={i} className="border p-2 text-center">{Math.round(r*100)}%</th>)}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row,ri)=>(
                <tr key={ri}>
                  <td className="border p-2 font-semibold">{row.user}</td>
                  {row.cells.map((c,ci)=>(
                    <td key={ci} className="border p-2 text-center">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
