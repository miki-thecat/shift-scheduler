"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, CheckCircle, Settings, Menu } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const NAV_ITEMS = [
    { label: "環境設定", href: "/manager/environment", icon: Settings },
    { label: "スタッフ管理", href: "/manager/staff", icon: Users },
    { label: "シフト自動生成", href: "/manager/generate", icon: Calendar },
    { label: "最終確認・出力", href: "/manager/confirm", icon: CheckCircle },
];

export default function ManagerLayout({ children }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white fixed h-full z-10 shadow-xl">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Calendar size={20} className="text-white" />
                        </div>
                        <h1 className="text-lg font-bold tracking-tight">Shift Master</h1>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">店長専用ポータル</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-slate-800 bg-slate-950/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg">
                            M
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Store Manager</p>
                            <p className="text-xs text-slate-500">店舗管理者</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white z-20 flex items-center justify-between p-4 shadow-md">
                <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-blue-500" />
                    <h1 className="font-bold">Shift Master</h1>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-30 pt-20 px-6 md:hidden">
                    <nav className="space-y-4">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={clsx(
                                    "flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium border border-transparent",
                                    pathname === item.href ? "bg-blue-600 text-white border-blue-500" : "text-slate-300 hover:bg-slate-800"
                                )}
                            >
                                <item.icon size={24} />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="absolute top-4 right-4 text-slate-400 p-2"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen transition-all duration-300">
                <div className="p-6 pt-20 md:p-8 md:pt-8 bg-gray-50/50 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
