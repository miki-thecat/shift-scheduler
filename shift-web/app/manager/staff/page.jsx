"use client";
import { useEffect, useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import clsx from "clsx";
import { StaffAPI } from "../../../lib/api";

export default function StaffPage() {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        StaffAPI.list()
            .then(data => {
                if (data.ok) setStaffList(data.items);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">スタッフ管理</h2>
                    <p className="text-slate-500">在籍スタッフの条件設定と個別プロファイル管理</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20">
                    <Plus size={18} />
                    スタッフ登録
                </button>
            </header>

            {/* Search & Filter */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="名前で検索..." className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-slate-500">並び替え:</span>
                    <select className="border border-slate-200 rounded-lg p-2 text-sm outline-none">
                        <option>登録順</option>
                        <option>勤務時間が多い順</option>
                        <option>希望日数が多い順</option>
                    </select>
                </div>
            </div>

            {/* Staff List Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">名前</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">希望パターン</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">週最大</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">前月実績</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">NG設定</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {staffList.map((staff) => (
                                <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{staff.name}</div>
                                        <div className="text-xs text-slate-500">{staff.profile}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "px-2 py-1 rounded-md text-xs font-bold",
                                            staff.preference === "AM" && "bg-orange-100 text-orange-700",
                                            staff.preference === "PM" && "bg-indigo-100 text-indigo-700",
                                            staff.preference === "Full" && "bg-green-100 text-green-700"
                                        )}>
                                            {staff.preference}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{staff.maxDays}日</td>
                                    <td className="px-6 py-4 text-slate-600">{staff.prevHours}h</td>
                                    <td className="px-6 py-4">
                                        {staff.ngDays === "なし" ? (
                                            <span className="text-slate-400">-</span>
                                        ) : (
                                            <span className="text-red-500 font-medium">{staff.ngDays}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-200 flex justify-center">
                    <button className="text-sm text-slate-500 hover:text-blue-600 font-medium">もっと見る</button>
                </div>
            </div>
        </div>
    );
}
