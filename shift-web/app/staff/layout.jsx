"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Layers, User, Settings } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const TAB_ITEMS = [
    { label: "シフト提出", href: "/staff/calendar", icon: Calendar },
    { label: "マイパターン", href: "/staff/templates", icon: Layers },
    { label: "設定・プロフ", href: "/staff/settings", icon: User },
];

export default function StaffLayout({ children }) {
    const pathname = usePathname();
    // Simulate checking user role in a real app

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* Mobile App-like Header */}
            <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b border-slate-100 flex items-center justify-between shadow-sm">
                <h1 className="font-bold text-lg text-slate-800">Shift App</h1>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <User size={16} />
                </div>
            </div>

            {/* Main Content Area - Constrained width for Tablet/Desktop */}
            <main className="max-w-md mx-auto p-4 min-h-[80vh]">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-20 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
                <div className="max-w-md mx-auto grid grid-cols-3">
                    {TAB_ITEMS.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex flex-col items-center justify-center py-3 gap-1 active:bg-slate-50 transition-colors",
                                    isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
