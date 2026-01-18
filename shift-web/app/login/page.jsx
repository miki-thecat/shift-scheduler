"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Lock, User } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Mock login
        setTimeout(() => {
            router.push("/manager");
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-8 text-center bg-slate-50 border-b border-slate-100">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-900/20">
                        <Calendar size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Shift Master</h1>
                    <p className="text-slate-500 text-sm mt-2">店舗管理者 ログイン</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">ID / メールアドレス</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="text" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="admin@example.com" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">パスワード</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="password" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="••••••••" required />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-slate-600">ログイン状態を保持</span>
                        </label>
                        <a href="#" className="text-blue-600 hover:underline font-medium">パスワードを忘れた場合</a>
                    </div>

                    <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            "ログインする"
                        )}
                    </button>
                </form>

                <div className="p-4 text-center bg-slate-50 text-sm border-t border-slate-100 flex flex-col gap-1">
                    <p className="text-slate-500">アカウントをお持ちでない方</p>
                    <a href="/register" className="text-blue-600 hover:underline font-bold">新規登録はこちら</a>
                </div>
            </div>
        </div>
    );
}
