"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Lock, User, Building, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault();
        setLoading(true);
        // Mock registration
        setTimeout(() => {
            router.push("/manager");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 text-center bg-slate-50 border-b border-slate-100">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-900/20">
                        <Calendar size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">アカウント作成</h1>
                    <p className="text-slate-500 text-sm mt-2">店舗管理者として登録します</p>
                </div>

                <form onSubmit={handleRegister} className="p-8 space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">店舗名</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="text" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="渋谷駅前店" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">店長氏名</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="text" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="山田 太郎" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">メールアドレス</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="email" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="manager@example.com" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">パスワード</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="password" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="8文字以上" required />
                            </div>
                        </div>
                    </div>

                    <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-6">
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <span className="flex items-center gap-2">登録して始める <ArrowRight size={18} /></span>
                        )}
                    </button>
                </form>

                <div className="p-4 text-center bg-slate-50 text-sm border-t border-slate-100">
                    すでにアカウントをお持ちですか？{" "}
                    <Link href="/login" className="text-blue-600 hover:underline font-bold">
                        ログインはこちら
                    </Link>
                </div>
            </div>
        </div>
    );
}
