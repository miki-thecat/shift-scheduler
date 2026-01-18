"use client";
import { Save, Clock, Users, Coffee } from "lucide-react";

export default function EnvironmentPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header>
                <h2 className="text-2xl font-bold text-slate-800">店舗環境設定</h2>
                <p className="text-slate-500">シフト自動生成の基準となる店舗ルールを設定します。</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shift Hours */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Clock className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">基本シフト時間帯</h3>
                            <p className="text-xs text-slate-500">各シフトの開始・終了時刻</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">午前シフト (Morning)</label>
                            <div className="flex items-center gap-2">
                                <input type="time" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="09:00" />
                                <span className="text-slate-400 font-medium">〜</span>
                                <input type="time" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="15:00" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">午後シフト (Afternoon)</label>
                            <div className="flex items-center gap-2">
                                <input type="time" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="15:00" />
                                <span className="text-slate-400 font-medium">〜</span>
                                <input type="time" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="22:00" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Headcount */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                            <Users className="text-green-600" size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">必要人数・定員</h3>
                            <p className="text-xs text-slate-500">1シフトあたりの最大人数</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">午前シフトの最大人数</label>
                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none" defaultValue="4" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">午後シフトの最大人数</label>
                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none" defaultValue="5" />
                        </div>
                    </div>
                </section>

                {/* Break Rules */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                            <Coffee className="text-orange-600" size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">休憩ルール</h3>
                            <p className="text-xs text-slate-500">労働基準法に基づく休憩設定</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">6時間超 8時間以下の休憩 (分)</label>
                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none" defaultValue="45" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">8時間超の休憩 (分)</label>
                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none" defaultValue="60" />
                        </div>
                    </div>
                </section>
            </div>

            <div className="flex justify-end pt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                    <Save size={18} />
                    設定を保存する
                </button>
            </div>
        </div>
    );
}
