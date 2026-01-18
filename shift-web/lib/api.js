export const API_BASE = "http://localhost:8000/api";

export async function fetcher(url) {
    const res = await fetch(`${API_BASE}${url}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}

// Optimized data fetching with SWR or React Query is recommended
// for N+1 avoidance and state management.
// For this prototype, we'll use simple fetch functions but structured for clear separation.

export const StaffAPI = {
    list: async () => fetcher("/users"),
    create: async (data) => {
        const res = await fetch(`${API_BASE}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return res.json();
    }
};

export const ShiftAPI = {
    getPeriod: async (id) => fetcher(`/periods/${id}`),
    listPeriods: async () => fetcher("/periods"),
    generate: async (periodId) => {
        const res = await fetch(`${API_BASE}/slots/generate?period_id=${periodId}`, { method: "POST" });
        return res.json();
    }
};
