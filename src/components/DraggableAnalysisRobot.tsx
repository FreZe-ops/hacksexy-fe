import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { getAssetUrl } from "../utils/assetUrl";
import "./DraggableAnalysisRobot.css";

type DraggableAnalysisRobotProps = {
  message: string;
  imageSrc?: string;
  className?: string;
  /** fixed = toàn trang; embedded = kéo trong khung màn hình game */
  variant?: "fixed" | "embedded";
  boundaryRef?: RefObject<HTMLElement | null>;
  topSlot?: ReactNode;
  hideBubble?: boolean;
};

const DEFAULT_IMAGE = "/assets/robot-result.gif";
const WIDGET_WIDTH = 280;
const WIDGET_HEIGHT = 320;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function DraggableAnalysisRobot({
  message,
  imageSrc = DEFAULT_IMAGE,
  className = "",
  variant = "fixed",
  boundaryRef,
  topSlot,
  hideBubble = false,
}: DraggableAnalysisRobotProps) {
  const isEmbedded = variant === "embedded";
  const [pos, setPos] = useState<{ x: number; y: number } | null>(
    isEmbedded ? { x: 0, y: 0 } : null
  );
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const getFixedLimits = useCallback(() => {
    const widget = widgetRef.current;
    const margin = 8;
    const widgetW = widget?.offsetWidth ?? WIDGET_WIDTH;
    const widgetH = widget?.offsetHeight ?? WIDGET_HEIGHT;
    return {
      margin,
      maxX: Math.max(margin, window.innerWidth - widgetW - margin),
      maxY: Math.max(margin, window.innerHeight - widgetH - margin),
    };
  }, []);

  const clampFixedPos = useCallback(
    (x: number, y: number) => {
      const limits = getFixedLimits();
      return {
        x: clamp(x, limits.margin, limits.maxX),
        y: clamp(y, limits.margin, limits.maxY),
      };
    },
    [getFixedLimits]
  );

  const getEmbeddedLimits = useCallback(() => {
    const boundary = boundaryRef?.current;
    const widget = widgetRef.current;
    if (!boundary || !widget) return null;

    const margin = 6;
    const maxX = Math.max(margin, boundary.clientWidth - widget.offsetWidth - margin);
    const maxY = Math.max(margin, boundary.clientHeight - widget.offsetHeight - margin);
    return { margin, maxX, maxY };
  }, [boundaryRef]);

  const clampEmbeddedPos = useCallback(
    (x: number, y: number) => {
      const limits = getEmbeddedLimits();
      if (!limits) return { x, y };
      return {
        x: clamp(x, limits.margin, limits.maxX),
        y: clamp(y, limits.margin, limits.maxY),
      };
    },
    [getEmbeddedLimits]
  );

  useEffect(() => {
    if (!isEmbedded) {
      const placeDefault = () => {
        const limits = getFixedLimits();
        setPos((prev) => {
          if (prev) return clampFixedPos(prev.x, prev.y);
          const centeredX = Math.max(
            limits.margin,
            Math.floor((window.innerWidth - (widgetRef.current?.offsetWidth ?? WIDGET_WIDTH)) / 2)
          );
          return clampFixedPos(centeredX, 140);
        });
      };

      placeDefault();
      window.addEventListener("resize", placeDefault);
      return () => window.removeEventListener("resize", placeDefault);
    }

    const boundary = boundaryRef?.current;
    if (!boundary) return;

    const placeDefault = () => {
      const limits = getEmbeddedLimits();
      if (!limits) return;
      const widget = widgetRef.current;
      const widgetW = widget?.offsetWidth ?? 280;
      const centeredX =
        topSlot && window.innerWidth <= 640
          ? Math.max(
              limits.margin,
              Math.floor((limits.maxX + limits.margin + widgetW) / 2 - widgetW / 2)
            )
          : limits.maxX;
      setPos(clampEmbeddedPos(centeredX, limits.maxY));
    };

    placeDefault();
    const ro = new ResizeObserver(placeDefault);
    ro.observe(boundary);
    return () => ro.disconnect();
  }, [isEmbedded, boundaryRef, getEmbeddedLimits, clampEmbeddedPos, topSlot, getFixedLimits, clampFixedPos]);

  useEffect(() => {
    if (isEmbedded) return;
    setPos((prev) => (prev ? clampFixedPos(prev.x, prev.y) : prev));
  }, [topSlot, hideBubble, isEmbedded, clampFixedPos]);

  useEffect(() => {
    if (!isEmbedded) return;
    setPos((prev) => {
      if (!prev) return prev;
      const limits = getEmbeddedLimits();
      if (!limits) return clampEmbeddedPos(prev.x, prev.y);
      if (topSlot && window.innerWidth <= 640) {
        const widget = widgetRef.current;
        const widgetW = widget?.offsetWidth ?? 280;
        const centeredX = Math.max(
          limits.margin,
          Math.floor((limits.maxX + limits.margin + widgetW) / 2 - widgetW / 2)
        );
        return clampEmbeddedPos(centeredX, limits.maxY);
      }
      return clampEmbeddedPos(prev.x, prev.y);
    });
  }, [topSlot, hideBubble, isEmbedded, clampEmbeddedPos, getEmbeddedLimits]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (pos == null) return;
      const target = event.target as HTMLElement;
      if (target.closest("input, button, textarea, select, a, label")) return;
      event.preventDefault();
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: pos.x,
        originY: pos.y,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [pos]
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;

      if (isEmbedded) {
        setPos(
          clampEmbeddedPos(drag.originX + dx, drag.originY + dy)
        );
        return;
      }

      setPos(clampFixedPos(drag.originX + dx, drag.originY + dy));
    },
    [isEmbedded, clampEmbeddedPos, clampFixedPos]
  );

  const onPointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  if (pos == null) return null;

  return (
    <div
      ref={widgetRef}
      className={`nh-robot-widget ${isEmbedded ? "nh-robot-widget--embedded" : ""} ${className}`.trim()}
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="presentation"
    >
      {topSlot ? <div className="nh-robot-widget__top-slot">{topSlot}</div> : null}
      {!hideBubble ? (
        <div className="nh-robot-widget__bubble-wrap" aria-live="polite">
          <div className="nh-robot-widget__bubble">
            <span className="nh-robot-widget__corner nh-robot-widget__corner--tl" aria-hidden />
            <span className="nh-robot-widget__corner nh-robot-widget__corner--br" aria-hidden />
            <p className="nh-robot-widget__text">{message}</p>
          </div>
          <div className="nh-robot-widget__tail" aria-hidden>
            <span className="nh-robot-widget__tail-fill" />
          </div>
        </div>
      ) : null}
      <img
        className="nh-robot-widget__img"
        src={getAssetUrl(imageSrc)}
        alt=""
        draggable={false}
      />
    </div>
  );
}
