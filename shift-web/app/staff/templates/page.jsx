"use client";
import { useState } from "react";
import { Plus, Clock, Edit2, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const MOCK_PATTERNS = [
    { id: 1, name: "いつもの早番", start: "09:00", end: "15:00", color: "bg-blue-100" },
    { id: 2, name: "授業後", start: "17:00", end: "22:00", color: "bg-purple-100" },
    { id: 3, name: "土曜ロング", start: "10:00", end: "20:00", color: "bg-green-100" },
];

export default function TemplatesPage() {
    const [patterns, setPatterns] = useState(MOCK_PATTERNS);

    return (
        <div className="pb-24 animate-in slide-in-from-right duration-300">
            <header className="flex items-center gap-4 mb-6">
                <Link href="/staff/calendar" className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft size={24} className="text-slate-600" />
                </Link>
                <h1 className="text-xl font-bold text-slate-800">マイパターン</h1>
            </header>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                <h2 className="font-bold text-lg mb-2 relative z-10 w-fit">パターン作成のメリット</h2>
                <p className="text-sm text-slate-500 relative z-10">
                    よく入る時間帯を登録しておくと、カレンダーからの入力が<span className="font-bold text-yellow-600 bg-yellow-100 px-1 mx-1 rounded">ワンタップ</span>で完了します。
                </p>
            </div>

            <div className="space-y-3">
                {patterns.map((p) => (
                    <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group active:scale-[0.99] transition-transform">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg ${p.color} flex items-center justify-center text-slate-700`}>
                                <Clock size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800">{p.name}</div>
                                <div className="text-xs text-slate-500 font-mono tracking-wide">{p.start} - {p.end}</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Edit2 size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                <button className="w-full text-left bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center gap-3 text-slate-500 transition-colors group">
                    <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-400 group-hover:text-blue-500">
                        <Plus size={24} />
                    </div>
                    <span className="font-bold group-hover:text-blue-600">新しいパターンを追加</span>
                </button>
            </div>
        </div>
    );
}
