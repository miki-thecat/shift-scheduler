"use client";
import Link from 'next/link';
import { ArrowRight, Users, Calendar, CheckCircle, Settings } from 'lucide-react';

export default function ManagerDashboard() {
  return (
    <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back, Manager</h1>
      <p className="text-slate-600 mb-10 text-lg">店舗管理ダッシュボードへようこそ。</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Main Call to Action */}
        <Link href="/manager/generate" className="col-span-1 md:col-span-2 group relative overflow-hidden p-8 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
              <Calendar size={24} className="text-white" />
            </div>
            <h3 className="font-bold text-2xl mb-2">新しいシフトを作成する</h3>
            <p className="text-indigo-100 mb-6 max-w-md">
              来月のシフト作成時期です。自動生成エンジンを使って、スタッフの希望を反映した最適なシフトを作成しましょう。
            </p>
            <span className="inline-flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors">
              開始する <ArrowRight size={16} />
            </span>
          </div>
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
        </Link>

        {/* Config Cards */}
        <Link href="/manager/staff" className="group p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Users size={20} />
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-2">スタッフ管理</h3>
          <p className="text-sm text-slate-500 mb-4 h-10">アルバイト従業員の登録、希望条件の確認を行います。</p>
          <span className="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            管理画面へ <ArrowRight size={16} />
          </span>
        </Link>

        <Link href="/manager/environment" className="group p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4 text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
            <Settings size={20} />
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-2">店舗環境設定</h3>
          <p className="text-sm text-slate-500 mb-4 h-10">営業時間、必要人数、休憩などの基本ルール設定。</p>
          <span className="text-slate-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            設定変更 <ArrowRight size={16} />
          </span>
        </Link>

        <Link href="/manager/confirm" className="group p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-green-400 hover:shadow-lg transition-all">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <CheckCircle size={20} />
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-2">確定・出力</h3>
          <p className="text-sm text-slate-500 mb-4 h-10">作成済みシフトの確認とPDF/LINEなどへの出力。</p>
          <span className="text-green-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            出力画面へ <ArrowRight size={16} />
          </span>
        </Link>

      </div>
    </div>
  )
}
