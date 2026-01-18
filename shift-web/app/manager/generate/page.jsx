"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Wand2, Save, Download, RefreshCw, AlertCircle, GripVertical } from "lucide-react";
import { motion, Reorder } from "framer-motion";
import clsx from "clsx";

const DAYS = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
        date: d.getDate(),
        day: ["日", "月", "火", "水", "木", "金", "土"][d.getDay()],
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
        id: `day-${i}`
    };
});

// Mock Initial Data
const MOCK_ASSIGNMENTS = {
    "day-0-am": [{ id: "s1", name: "田中", color: "bg-blue-100 text-blue-700" }, { id: "s2", name: "佐藤", color: "bg-green-100 text-green-700" }],
    "day-0-pm": [{ id: "s3", name: "鈴木", color: "bg-purple-100 text-purple-700" }],
    "day-1-am": [{ id: "s4", name: "高橋", color: "bg-orange-100 text-orange-700" }],
    // ... populate dynamically in real app
};

export default function GeneratePage() {
    const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">シフト自動生成</h2>
                    <p className="text-slate-500">2026年 1月 第3週</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                        <button className="p-2 hover:bg-slate-100 rounded-md"><ChevronLeft size={18} /></button>
                        <button className="px-4 py-1 text-sm font-bold text-slate-700">今週</button>
                        <button className="p-2 hover:bg-slate-100 rounded-md"><ChevronRight size={18} /></button>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all">
                        <Wand2 size={18} />
                        AI 自動生成
                    </button>
                    <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all">
                        <Save size={18} />
                        保存
                    </button>
                </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden flex flex-col">
                {/* Calendar Header */}
                <div className="flex border-b border-slate-200">
                    <div className="w-32 p-4 bg-slate-50 font-bold text-slate-500 flex-shrink-0 flex items-center justify-center border-r border-slate-200">
                        時間帯
                    </div>
                    <div className="flex-1 grid grid-cols-7 divide-x divide-slate-200">
                        {DAYS.map((d) => (
                            <div key={d.id} className={clsx(
                                "p-3 text-center",
                                d.isWeekend ? "bg-orange-50/50" : "bg-slate-50"
                            )}>
                                <div className="text-xs text-slate-500 mb-1">{d.day}曜日</div>
                                <div className={clsx("text-lg font-bold", d.isWeekend ? "text-orange-600" : "text-slate-800")}>{d.date}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rows Area - Scrollable if needed */}
                <div className="flex-1 overflow-auto">
                    {/* AM ROW */}
                    <div className="flex min-h-[180px] border-b border-slate-100 group">
                        <div className="w-32 bg-slate-50/50 p-4 border-r border-slate-200 flex flex-col justify-center items-center flex-shrink-0 group-hover:bg-slate-100 transition-colors">
                            <span className="font-bold text-slate-700 text-lg">午前</span>
                            <span className="text-xs text-slate-400">09:00 - 15:00</span>
                            <div className="mt-3 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">必要: 4名</div>
                        </div>
                        <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100">
                            {DAYS.map((d) => (
                                <div key={d.id} className="p-2 relative hover:bg-slate-50/80 transition-colors">
                                    {/* Drop Zone */}
                                    <div className="h-full rounded-lg border-2 border-dashed border-transparent hover:border-blue-200 transition-colors p-2 space-y-2">
                                        {(MOCK_ASSIGNMENTS[`${d.id}-am`] || []).map((staff) => (
                                            <div key={staff.id} className={clsx("p-2 rounded-lg shadow-sm text-sm font-bold flex items-center justify-between cursor-grab active:cursor-grabbing", staff.color)}>
                                                <span>{staff.name}</span>
                                                <GripVertical size={14} className="opacity-50" />
                                            </div>
                                        ))}
                                        {/* Placeholder for Empty */}
                                        {!(MOCK_ASSIGNMENTS[`${d.id}-am`] || []).length && (
                                            <div className="h-full flex items-center justify-center text-slate-300 text-xs">
                                                ドラッグして配置
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PM ROW */}
                    <div className="flex min-h-[180px] border-b border-slate-100 group">
                        <div className="w-32 bg-slate-50/50 p-4 border-r border-slate-200 flex flex-col justify-center items-center flex-shrink-0 group-hover:bg-slate-100 transition-colors">
                            <span className="font-bold text-slate-700 text-lg">午後</span>
                            <span className="text-xs text-slate-400">15:00 - 22:00</span>
                            <div className="mt-3 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">必要: 5名</div>
                        </div>
                        <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100">
                            {DAYS.map((d) => (
                                <div key={d.id} className="p-2 relative hover:bg-slate-50/80 transition-colors">
                                    <div className="h-full rounded-lg border-2 border-dashed border-transparent hover:border-green-200 transition-colors p-2 space-y-2">
                                        {(MOCK_ASSIGNMENTS[`${d.id}-pm`] || []).map((staff) => (
                                            <div key={staff.id} className={clsx("p-2 rounded-lg shadow-sm text-sm font-bold flex items-center justify-between cursor-grab active:cursor-grabbing", staff.color)}>
                                                <span>{staff.name}</span>
                                                <GripVertical size={14} className="opacity-50" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Unassigned / Warning Footer */}
            <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-orange-800">調整が必要な箇所があります</h4>
                    <p className="text-xs text-orange-600">1月20日(火) 午前の人数が不足しています (-2名)</p>
                </div>
                <div className="ml-auto">
                    <button className="text-sm font-bold text-orange-700 underline">詳細を見る</button>
                </div>
            </div>
        </div>
    );
}
