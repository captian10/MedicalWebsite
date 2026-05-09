"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function VisitorCounter() {
    const [count, setCount] = useState<number | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const trackVisit = async () => {
            // التحقق مما إذا كان الزائر قد تم حسابه في هذه الجلسة
            const hasVisited = sessionStorage.getItem("has_visited");

            if (!hasVisited) {
                // زيادة العداد في قاعدة البيانات عبر الدالة التي أنشأناها
                await supabase.rpc("increment_page_view");
                sessionStorage.setItem("has_visited", "true");
            }

            // جلب الرقم الحالي وعرضه
            const { data, error } = await supabase
                .from("visitor_tracking")
                .select("view_count")
                .eq("id", 1)
                .single();

            if (data && !error) {
                setCount(data.view_count);
            }
        };

        trackVisit();
    }, [supabase]);

    if (count === null) return null;
    return (
        <div className="mt-6 flex items-center gap-3 rounded-lg bg-transparent p-2 border-l-2 border-medical-600">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-medical-600/10">
                <Users className="h-5 w-5 text-medical-500" />
            </div>
            <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">Viewed By</p>
                <p className="text-lg font-bold text-white tracking-wide">
                    {count?.toLocaleString("en-US") || "0"} <span className="text-sm font-normal text-zinc-500">Doctors</span>
                </p>
            </div>
        </div>
    );
}