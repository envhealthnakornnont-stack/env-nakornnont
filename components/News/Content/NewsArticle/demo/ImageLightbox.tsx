// features/content/shared/ImageLightbox.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { X, Plus, Minus, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  src: string | null;
  alt?: string;
  caption?: string | null;
};

const MIN_SCALE = 1;
const MID_SCALE = 2;
const MAX_SCALE = 4;

// คอนฟิก inertia
const FRICTION = 0.92;     // 0.9-0.96 = หนืดขึ้น/ช้าลง
const STOP_EPS = 10;       // px/s หยุดแอนิเมชันเมื่อช้ามากพอ
const MAX_VELOCITY = 5000; // เพดานความเร็วกันกระชาก

export default function ImageLightbox({ open, onOpenChange, src, alt, caption }: Props) {
  const ready = Boolean(src);
  const boxRef = React.useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = React.useState(MIN_SCALE);
  const [tx, setTx] = React.useState(0);
  const [ty, setTy] = React.useState(0);

  // สำหรับ pan inertia
  const dragRef = React.useRef({
    dragging: false,
    x: 0,
    y: 0,
  });
  const velRef = React.useRef({ vx: 0, vy: 0, t: 0 }); // px/s
  const rafRef = React.useRef<number | null>(null);

  // pinch gesture
  const lastTapRef = React.useRef(0);
  const pinchRef = React.useRef({
    active: false,
    startDist: 0,
    startScale: 1,
    startTx: 0,
    startTy: 0,
    midX: 0,
    midY: 0,
  });

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const constrainPan = React.useCallback(
    (s: number, x: number, y: number) => {
      // คำนวณขอบเขต pan จากขนาดคอนเทนเนอร์และสเกล (scale ของชั้น transform ทั้งกรอบ)
      const rect = boxRef.current?.getBoundingClientRect();
      if (!rect || s <= 1) return { x: 0, y: 0 };

      const maxX = (rect.width * (s - 1)) / 2;
      const maxY = (rect.height * (s - 1)) / 2;

      return {
        x: clamp(x, -maxX, maxX),
        y: clamp(y, -maxY, maxY),
      };
    },
    []
  );

  const reset = React.useCallback(() => {
    setScale(MIN_SCALE);
    setTx(0);
    setTy(0);
    velRef.current = { vx: 0, vy: 0, t: 0 };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  // ---------- Wheel zoom (ctrl + wheel) ----------
  const onWheel = (e: React.WheelEvent) => {
    if (!boxRef.current || !e.ctrlKey) return;
    e.preventDefault();

    const rect = boxRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.12 : 0.9;
    const newScale = clamp(scale * factor, MIN_SCALE, MAX_SCALE);

    const k = newScale / scale;
    const nx = (tx - (cx - rect.width / 2)) * k + (cx - rect.width / 2);
    const ny = (ty - (cy - rect.height / 2)) * k + (cy - rect.height / 2);

    const c = constrainPan(newScale, nx, ny);
    setScale(newScale);
    setTx(c.x);
    setTy(c.y);
  };

  // ---------- Zoom controls ----------
  const zoomIn = () => {
    const rect = boxRef.current?.getBoundingClientRect();
    const newScale = clamp(scale * 1.25, MIN_SCALE, MAX_SCALE);
    const k = newScale / scale;
    const cx = rect ? rect.width / 2 : 0;
    const cy = rect ? rect.height / 2 : 0;
    const nx = (tx - (cx - (rect?.width ?? 0) / 2)) * k + (cx - (rect?.width ?? 0) / 2);
    const ny = (ty - (cy - (rect?.height ?? 0) / 2)) * k + (cy - (rect?.height ?? 0) / 2);
    const c = constrainPan(newScale, nx, ny);
    setScale(newScale);
    setTx(c.x);
    setTy(c.y);
  };

  const zoomOut = () => {
    const newScale = clamp(scale / 1.25, MIN_SCALE, MAX_SCALE);
    const c = constrainPan(newScale, tx, ty);
    setScale(newScale);
    setTx(c.x);
    setTy(c.y);
    if (newScale === 1) {
      velRef.current = { vx: 0, vy: 0, t: 0 };
    }
  };

  const onDoubleClick = () => {
    const target = scale < MID_SCALE ? MID_SCALE : MIN_SCALE;
    const c = constrainPan(target, 0, 0);
    setScale(target);
    setTx(c.x);
    setTy(c.y);
    velRef.current = { vx: 0, vy: 0, t: 0 };
  };

  // ---------- Inertia ----------
  const startInertia = React.useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const step = (t: number) => {
      // dt ในวินาที
      if (velRef.current.t === 0) velRef.current.t = t;
      const dt = (t - velRef.current.t) / 1000;
      velRef.current.t = t;

      // ลดความเร็วด้วย friction
      velRef.current.vx *= FRICTION;
      velRef.current.vy *= FRICTION;

      // หยุดเมื่อช้ามาก
      const speed = Math.hypot(velRef.current.vx, velRef.current.vy);
      if (speed < STOP_EPS || scale <= 1) {
        rafRef.current = null;
        return;
      }

      // อัปเดตตำแหน่งตามความเร็ว
      let nx = tx + velRef.current.vx * dt;
      let ny = ty + velRef.current.vy * dt;

      // บีบให้อยู่ในขอบเขต ถ้าชนขอบให้สะท้อนนิด ๆ (ลดแรง)
      const c = constrainPan(scale, nx, ny);
      if (c.x !== nx) {
        velRef.current.vx *= -0.3;
        nx = c.x;
      }
      if (c.y !== ny) {
        velRef.current.vy *= -0.3;
        ny = c.y;
      }

      setTx(nx);
      setTy(ny);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [scale, tx, ty, constrainPan]);

  // ---------- Touch gestures (no preventDefault; rely on CSS touch-action) ----------
  const onTouchStart = (e: React.TouchEvent) => {
    if (!boxRef.current) return;

    // หยุด inertia ปัจจุบัน
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (e.touches.length === 1) {
      const now = performance.now();
      if (now - lastTapRef.current < 280) {
        onDoubleClick();
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;

      dragRef.current.dragging = true;
      dragRef.current.x = e.touches[0].clientX - tx;
      dragRef.current.y = e.touches[0].clientY - ty;

      velRef.current = { vx: 0, vy: 0, t: performance.now() };
    } else if (e.touches.length === 2) {
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      const dist = Math.hypot(dx, dy);

      const rect = boxRef.current.getBoundingClientRect();
      const midX = (t1.clientX + t2.clientX) / 2 - rect.left;
      const midY = (t1.clientY + t2.clientY) / 2 - rect.top;

      pinchRef.current = {
        active: true,
        startDist: dist,
        startScale: scale,
        startTx: tx,
        startTy: ty,
        midX,
        midY,
      };
      velRef.current = { vx: 0, vy: 0, t: performance.now() };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!boxRef.current) return;

    const now = performance.now();
    const dt = Math.max(1, now - velRef.current.t) / 1000; // s
    velRef.current.t = now;

    if (pinchRef.current.active && e.touches.length === 2) {
      // pinch zoom
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      const dist = Math.hypot(dx, dy);

      const ratio = dist / (pinchRef.current.startDist || 1);
      const newScale = clamp(pinchRef.current.startScale * ratio, MIN_SCALE, MAX_SCALE);

      const rect = boxRef.current.getBoundingClientRect();
      const cx = pinchRef.current.midX;
      const cy = pinchRef.current.midY;
      const k = newScale / pinchRef.current.startScale;

      const nx = (pinchRef.current.startTx - (cx - rect.width / 2)) * k + (cx - rect.width / 2);
      const ny = (pinchRef.current.startTy - (cy - rect.height / 2)) * k + (cy - rect.height / 2);
      const c = constrainPan(newScale, nx, ny);

      setScale(newScale);
      setTx(c.x);
      setTy(c.y);

      // รีเซ็ตความเร็ว (โหมด pinch ไม่ใช้ inertia)
      velRef.current.vx = 0;
      velRef.current.vy = 0;
    } else if (dragRef.current.dragging && e.touches.length === 1 && scale > 1) {
      const px = e.touches[0].clientX - dragRef.current.x;
      const py = e.touches[0].clientY - dragRef.current.y;
      const c = constrainPan(scale, px, py);

      // ความเร็ว (px/s) = Δระยะ / Δเวลา
      velRef.current.vx = clamp((c.x - tx) / dt, -MAX_VELOCITY, MAX_VELOCITY);
      velRef.current.vy = clamp((c.y - ty) / dt, -MAX_VELOCITY, MAX_VELOCITY);

      setTx(c.x);
      setTy(c.y);
    }
  };

  const onTouchEnd = () => {
    pinchRef.current.active = false;
    dragRef.current.dragging = false;

    if (scale <= 1) {
      setTx(0);
      setTy(0);
      return;
    }

    // เริ่ม inertia หลังปล่อยนิ้ว
    startInertia();
  };

  // ---------- Pointer pan (mouse) ----------
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || scale <= 1) return;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    dragRef.current.dragging = true;
    dragRef.current.x = e.clientX - tx;
    dragRef.current.y = e.clientY - ty;
    velRef.current = { vx: 0, vy: 0, t: performance.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    const now = performance.now();
    const dt = Math.max(1, now - velRef.current.t) / 1000;
    velRef.current.t = now;

    const px = e.clientX - dragRef.current.x;
    const py = e.clientY - dragRef.current.y;
    const c = constrainPan(scale, px, py);

    velRef.current.vx = clamp((c.x - tx) / dt, -MAX_VELOCITY, MAX_VELOCITY);
    velRef.current.vy = clamp((c.y - ty) / dt, -MAX_VELOCITY, MAX_VELOCITY);

    setTx(c.x);
    setTy(c.y);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) return;
    dragRef.current.dragging = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    if (scale <= 1) {
      setTx(0);
      setTy(0);
      return;
    }
    startInertia();
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key.toLowerCase() === "r") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, reset]);

  const transform = `translate(${tx}px, ${ty}px) scale(${scale})`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 border-0 bg-transparent shadow-none max-w-none w-auto"
        onWheel={onWheel}
      >
        <VisuallyHidden>
          <DialogTitle>{alt || "รูปภาพ"}</DialogTitle>
          <DialogDescription>{caption || ""}</DialogDescription>
        </VisuallyHidden>

        {/* Close */}
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => onOpenChange(false)}
          aria-label="ปิดรูปภาพ"
          className="absolute right-3 top-3 z-50 rounded-full bg-background/80 backdrop-blur hover:bg-background/90"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Zoom toolbar */}
        <div
          className="absolute left-1/2 top-3 z-50 -translate-x-1/2 flex items-center gap-2 rounded-full bg-background/80 p-1.5 backdrop-blur ring-1 ring-border"
          role="group"
          aria-label="เครื่องมือซูม"
        >
          <Button size="icon" variant="ghost" onClick={zoomOut} aria-label="ซูมออก">
            <Minus className="h-4 w-4" />
          </Button>
          <div className="min-w-10 text-center text-xs tabular-nums">
            {Math.round(scale * 100)}%
          </div>
          <Button size="icon" variant="ghost" onClick={zoomIn} aria-label="ซูมเข้า">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={reset} aria-label="รีเซ็ตการซูม">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Image box: ใส่ touch-none + overscroll-contain เพื่อกัน scroll หน้าจอและ passive warning */}
        <div
          ref={boxRef}
          className="
            relative z-40 mx-auto
            w-[92vw] max-w-[1100px]
            h-[72vh] sm:h-[78vh] lg:h-[84vh]
            overflow-hidden rounded-xl bg-background/70 backdrop-blur ring-1 ring-border
            cursor-[grab] data-[dragging=true]:cursor-[grabbing]
            touch-none overscroll-contain select-none
          "
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onDoubleClick={onDoubleClick}
          data-dragging={dragRef.current.dragging ? "true" : "false"}
          role="img"
          aria-label={alt || "รูปภาพ"}
        >
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              transform,
              transition:
                dragRef.current.dragging || pinchRef.current.active
                  ? "none"
                  : "transform 120ms ease-out",
            }}
          >
            {ready ? (
              <Image
                src={src!}
                alt={alt || ""}
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 1100px, 92vw"
                priority
                draggable={false}
              />
            ) : null}
          </div>
        </div>

        {caption ? (
          <div className="mx-auto mt-3 max-w-[1100px] px-4 text-center">
            <p className="text-xs text-muted-foreground">{caption}</p>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
