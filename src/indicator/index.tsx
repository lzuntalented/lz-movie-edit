import React, { useContext, useEffect, useRef } from 'react';
import Context from '../context';
import store from '../store';
import { formatTime, setupCanvas } from '../utils';
import './index.scss';
import { SCALE_DOM_SPACE } from '../common/config';

function Indicator() {
  const { refresh } = useContext(Context);
  const total = store.getTotalTime();
  const lines = new Array(Math.ceil(total / 1000 * store.timerScale) + 10).fill(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d', 60) as CanvasRenderingContext2D;

      const ratio = (window.devicePixelRatio || 1);
      const width = lines.length * SCALE_DOM_SPACE;

      if (ratio > 1) {
        // const height = defaultHeiht || this.height;
        canvasRef.current.style.height = `${60}px`;
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.width = width * ratio;
        canvasRef.current.height = 60 * ratio;
      }

      lines.forEach((line, i) => {
        const x = i * SCALE_DOM_SPACE;
        const y = 0;
        const height = i % 5 === 0 ? 10 : 5;
        ctx.strokeStyle = '#cdd5de';
        ctx.beginPath();
        ctx.moveTo(x * ratio, y * ratio);
        ctx.lineTo(x * ratio, (y + height) * ratio);
        ctx.lineWidth *= ratio;
        ctx.stroke();
        ctx.lineWidth /= ratio;
        if (i % 10 === 0 && i !== 0) {
          const timeStr = `${Math.floor((i / store.timerScale * 10)) / 10}s`;
          ctx.fillStyle = '#262e48';
          ctx.font = ctx.font.replace(
            /(\d+)(px|em|rem|pt)/g,
            (w, m, u) => (m * ratio) + u,
          );
          ctx.fillText(timeStr, x * ratio, (y + (height * 2)) * ratio);
          ctx.font = ctx.font.replace(
            /(\d+)(px|em|rem|pt)/g,
            (w, m, u) => (m / ratio) + u,
          );
        }
      });
    }
  }, [total, store.timerScale]);

  const lastX = useRef({
    x: 0,
    moving: false,
    curX: 0,
  });
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const x = e.clientX;
    lastX.current = { x, moving: true, curX: x };

    const { x: elx } = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
    const time = (x - elx) / SCALE_DOM_SPACE * (1000 / store.timerScale);
    store.setCurrentTime(time);
    store.pause();
    refresh();
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (lastX.current.moving) {
      const x = e.clientX || lastX.current.curX;
      const time = (x - lastX.current.x) / SCALE_DOM_SPACE * (1000 / store.timerScale);
      lastX.current.x = x;
      store.setCurrentTime(store.currentTime + time);
      store.pause();
      refresh();
    }
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (lastX.current.moving) {
      const x = e.clientX || lastX.current.curX;
      const time = (x - lastX.current.x) / SCALE_DOM_SPACE * (1000 / store.timerScale);
      store.setCurrentTime(store.currentTime + time);
      store.pause();
      refresh();
    }
    lastX.current = { x: 0, moving: false, curX: 0 };
  };

  const indicatorLeft = (store.currentTime / 1000) * store.timerScale * SCALE_DOM_SPACE;
  return (
    <div
      className="indicator"
      style={{ width: lines.length * 10 + 10 * 10 }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseLeave}
    >
      <div className="indicator-point" style={{ left: indicatorLeft }} />
      <canvas
        ref={canvasRef}
        width={lines.length * 10 + 10 * 10}
        height={60}
      />
    </div>
  );
}

export default Indicator;
