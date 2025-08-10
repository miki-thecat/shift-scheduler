"use client";
import { useState } from "react";

export deafult function AvailabilityPage() {
    const [ok, setOK] = useState(false);
    async function submit() {
         const payload = {
      line_user_id: "dev-user",
      items: [{ date: "2025-08-15", start: "2025-08-15T09:00:00", end: "2025-08-15T13:00:00", status: "prefer" }]
    };
    }
}
