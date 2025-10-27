"use client";

import * as React from "react";
import type { StorageMode } from "./types";
import { cookieKey } from "./utils";

export default function Dismissible({
    children,
    id,
    storage = "session",
    ttlMs,
}: {
    children: (close: () => void) => React.ReactNode;
    id?: string; 
    storage?: StorageMode;
    ttlMs?: number;
}) {
    const [open, setOpen] = React.useState(true);

    // อ่านสถานะฝั่ง client อีกรอบ (กันกรณี SSR บอกให้โชว์ แต่ client เคยปิดไว้ในแท็บนี้)
    React.useEffect(() => {
        if (!id) return;
        try {
            const raw = (storage === "local" ? localStorage : sessionStorage).getItem(cookieKey(id));
            if (!raw) return;
            const { closedAt } = JSON.parse(raw) as { closedAt: number };
            if (!ttlMs || Date.now() - closedAt < ttlMs) setOpen(false);
        } catch { }
    }, [id, storage, ttlMs]);

    const close = () => {
        setOpen(false);
        if (!id) return;
        const key = cookieKey(id);
        const now = Date.now();
        // เขียน cookie → SSR รอบถัดไปรู้ว่าให้ซ่อน
        let cookie = `${key}=${encodeURIComponent(JSON.stringify({ closedAt: now }))}; path=/; SameSite=Lax`;
        if (ttlMs) cookie += `; max-age=${Math.ceil(ttlMs / 1000)}`;
        document.cookie = cookie;

        // เขียน storage ฝั่ง client (ต่อแท็บหรือทั้งเบราว์เซอร์)
        try {
            const store = storage === "local" ? localStorage : sessionStorage;
            store.setItem(key, JSON.stringify({ closedAt: now }));
        } catch { }
    };

    if (!open) return null;
    return <>{children(close)}</>;
}
