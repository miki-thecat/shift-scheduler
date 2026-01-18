"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

// Helper for calendar generation
const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const days = [];

    // Padding for start of month
    for (let i = 0; i < firstDay.getDay(); i++) {
        days.push({ key: `pad-start-${i}`, empty: true });
    }

    // Days
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const d = new Date(year, month - 1, i);
        days.push({
            key: `day-${i}`,
            date: i,
            dayOfWeek: d.getDay(),
            isWeekend: d.getDay() === 0 || d.getDay() === 6
        });
    }

    return days;
};

// Mock Shift Data
const MOCK_SHIFTS = {
    "2026-02-05": { type: "AM", label: "早番", color: "bg-blue-100 text-blue-700" },
    "2026-02-12": { type: "PM", label: "遅番", color: "bg-orange-100 text-orange-700" },
    "2026-02-20": { type: "OFF", label: "NG", color: "bg-red-50 text-red-400" },
};

export default function StaffCalendarPage() {
    const [year, setYear] = useState(2026);
    const [month, setMonth] = useState(2);
    const [selectedDate, setSelectedDate] = useState(null);
    const [shifts, setShifts] = useState(MOCK_SHIFTS);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const days = generateCalendar(year, month);
    const monthLabel = `${year}年 ${month}月`;

    const handleDayClick = (day) => {
        setSelectedDate(day);
        setIsDrawerOpen(true);
    };

    const handleSaveShift = (type) => {
        if (!selectedDate) return;

        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(selectedDate.date).padStart(2, '0')}`;
        let newShift = null;

        if (type === "AM") newShift = { type: "AM", label: "早番", color: "bg-blue-100 text-blue-700" };
        else if (type === "PM") newShift = { type: "PM", label: "遅番", color: "bg-orange-100 text-orange-700" };
        else if (type === "FULL") newShift = { type: "FULL", label: "通し", color: "bg-purple-100 text-purple-700" };
        else if (type === "OFF") newShift = { type: "OFF", label: "NG", color: "bg-red-50 text-red-500" };

        setShifts(prev => {
            const next = { ...prev };
            if (newShift) next[dateKey] = newShift;
            else delete next[dateKey]; // Clear
            return next;
        });
        setIsDrawerOpen(false);
    };

    return (
        <div className="pb-24">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-bold text-slate-800">{monthLabel}</h2>
                <div className="flex gap-2">
                    <button className="p-2 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50"><ChevronLeft size={20} /></button>
                    <button className="p-2 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50"><ChevronRight size={20} /></button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Week Headers */}
                <div className="grid grid-cols-7 border-b border-slate-100">
                    {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
                        <div key={d} className={clsx("py-3 text-center text-xs font-bold", i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-slate-400")}>
                            {d}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7">
                    {days.map((d) => {
                        if (d.empty) return <div key={d.key} className="aspect-square bg-slate-50/30" />;

                        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(d.date).padStart(2, '0')}`;
                        const shift = shifts[dateKey];
                        const isSelected = selectedDate?.date === d.date;

                        return (
                            <div
                                key={d.key}
                                onClick={() => !d.empty && handleDayClick(d)}
                                className={clsx(
                                    "aspect-square border-t border-r border-slate-50 p-1 relative cursor-pointer outline-none transition-colors select-none",
                                    d.isWeekend ? "bg-slate-50/20" : "",
                                    isSelected ? "bg-blue-50 ring-2 ring-inset ring-blue-400 z-10" : "active:bg-slate-100"
                                )}>
                                <span className={clsx("text-sm font-medium ml-1", d.isWeekend ? "text-slate-600" : "text-slate-700")}>{d.date}</span>

                                {shift && (
                                    <div className={clsx(
                                        "absolute bottom-1 left-1 right-1 text-[10px] font-bold text-center rounded py-0.5 shadow-sm truncate",
                                        shift.color
                                    )}>
                                        {shift.label}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 text-center text-slate-400 text-sm">
                <p>日付をタップして希望を入力してください</p>
            </div>

            {/* Submit Button (Floating) */}
            <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto z-10">
                <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                    シフトを提出する
                </button>
            </div>

            {/* Input Drawer (Overlay) */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDrawerOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-40 p-6 pb-safe max-w-md mx-auto shadow-2xl"
                        >
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-slate-800">
                                    {month}月{selectedDate?.date}日 ({["日", "月", "火", "水", "木", "金", "土"][selectedDate?.dayOfWeek]})
                                </h3>
                                <button onClick={() => handleSaveShift(null)} className="text-slate-400 text-sm hover:text-red-500 font-bold px-2 py-1">クリア</button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button onClick={() => handleSaveShift("AM")} className="p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold transition-colors flex flex-col items-center gap-1">
                                    <span className="text-lg">早番 (AM)</span>
                                    <span className="text-xs opacity-70">09:00 - 15:00</span>
                                </button>
                                <button onClick={() => handleSaveShift("PM")} className="p-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl font-bold transition-colors flex flex-col items-center gap-1">
                                    <span className="text-lg">遅番 (PM)</span>
                                    <span className="text-xs opacity-70">15:00 - 22:00</span>
                                </button>
                                <button onClick={() => handleSaveShift("FULL")} className="p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold transition-colors flex flex-col items-center gap-1">
                                    <span className="text-lg">フルタイム</span>
                                    <span className="text-xs opacity-70">ALL DAY</span>
                                </button>
                                <button onClick={() => handleSaveShift("OFF")} className="p-4 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl font-bold transition-colors flex flex-col items-center gap-1">
                                    <span className="text-lg">NG (休み)</span>
                                    <span className="text-xs opacity-70">入れません</span>
                                </button>
                            </div>

                            <button className="w-full py-3 border border-slate-200 rounded-xl text-slate-600 font-bold flex items-center justify-center gap-2 hover:bg-slate-50">
                                <Plus size={18} />
                                マイパターンから選択
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
