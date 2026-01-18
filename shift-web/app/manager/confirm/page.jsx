"use client";
import { Download, Share2, Printer, FileSpreadsheet } from "lucide-react";

export default function ConfirmPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <header>
                <h2 className="text-2xl font-bold text-slate-800">最終確認・出力</h2>
                <p className="text-slate-500">確定したシフトをスタッフに共有またはファイルとして出力します。</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Preview Card (Mock) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">シフトプレビュー</h3>
                    <div className="flex-1 min-h-[300px] bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden group">
                        <div className="absolute inset-x-0 top-0 h-4 bg-slate-200/50"></div>
                        <div className="absolute inset-x-0 bottom-0 h-4 bg-slate-200/50"></div>
                        <div className="space-y-2 w-3/4 opacity-30 group-hover:opacity-40 transition-opacity">
                            <div className="h-4 bg-slate-300 rounded w-full"></div>
                            <div className="h-4 bg-slate-300 rounded w-5/6"></div>
                            <div className="h-4 bg-slate-300 rounded w-full"></div>
                            <div className="h-4 bg-slate-300 rounded w-4/6"></div>
                        </div>
                        <p className="mt-4 font-medium z-10">PDF Preview Generated</p>
                    </div>
                    <div className="mt-6 flex justify-between items-center text-sm p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-600 font-medium">対象期間: 2026/01/15 - 2026/01/21</span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            確定済み
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg mb-4 text-slate-800">データ出力</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group active:scale-[0.99]">
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-100 p-3 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                        <FileSpreadsheet size={24} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-slate-700 group-hover:text-green-700">Excel / CSV 出力</div>
                                        <div className="text-xs text-slate-500">管理用データとしてダウンロード</div>
                                    </div>
                                </div>
                                <Download size={20} className="text-slate-300 group-hover:text-green-600" />
                            </button>

                            <button className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all group active:scale-[0.99]">
                                <div className="flex items-center gap-4">
                                    <div className="bg-red-100 p-3 rounded-lg text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                        <Printer size={24} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-slate-700 group-hover:text-red-700">PDF 印刷用</div>
                                        <div className="text-xs text-slate-500">店舗掲示用に最適化されたレイアウト</div>
                                    </div>
                                </div>
                                <Download size={20} className="text-slate-300 group-hover:text-red-600" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg mb-4 text-slate-800">共有</h3>
                        <button className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-900/10 transition-all active:scale-[0.98]">
                            <Share2 size={24} />
                            LINEでスタッフに一斉送信
                        </button>
                        <div className="mt-4 flex items-start gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-lg">
                            <span className="font-bold text-slate-500">Note:</span>
                            <span>全員のLINEアカウントが連携されている必要があります。未連携のスタッフにはメールで送られます。</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
