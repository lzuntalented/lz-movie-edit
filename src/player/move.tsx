import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

import {
  POINT_LEFT_CENTER, POINT_RIGHT_CENTER, POINT_TOP_CENTER, POINT_BOTTOM_CENTER,
  POINT_LEFT_TOP, POINT_RIGHT_TOP, POINT_LEFT_BOTTOM, POINT_RIGHT_BOTTOM, POINT_ROTATE,
} from '../common/config';
import store from '../store';

interface Props {
  onChange(): void
  children: React.ReactElement
}

function Move(props: Props) {
  const { children, onChange } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [dragInfo, setDragInfo] = useState<{
    mode: 'move' | 'scale';
    key: string | null;
    startX: number;
    startY: number;
    startRect: { left: number; top: number; width: number; height: number };
  } | null>(null);

  const updateRect = () => {
    if (ref?.current) {
      const el = ref.current;
      const areaPlayer = document.querySelector('.area-player') as HTMLElement;

      if (areaPlayer) {
        const elRect = el.getBoundingClientRect();
        const playerRect = areaPlayer.getBoundingClientRect();

        setRect({
          left: elRect.left - playerRect.left,
          top: elRect.top - playerRect.top,
          width: elRect.width,
          height: elRect.height,
        });
      }
    }
  };

  useEffect(() => {
    const timeout = setTimeout(updateRect, 50);
    window.addEventListener('resize', updateRect);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateRect);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(updateRect, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!dragInfo) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragInfo.startX;
      const dy = e.clientY - dragInfo.startY;
      const { startRect, key } = dragInfo;

      if (dragInfo.mode === 'move') {
        const newLeft = startRect.left + dx;
        const newTop = startRect.top + dy;
        setRect((prev) => ({ ...prev, left: newLeft, top: newTop }));

        if (ref.current) {
          ref.current.style.transform = `translate(${dx}px, ${dy}px)`;
        }
      } else if (dragInfo.mode === 'scale') {
        const isRight = key === POINT_RIGHT_CENTER || key === POINT_RIGHT_TOP || key === POINT_RIGHT_BOTTOM;
        const isLeft = key === POINT_LEFT_CENTER || key === POINT_LEFT_TOP || key === POINT_LEFT_BOTTOM;
        const isBottom = key === POINT_BOTTOM_CENTER || key === POINT_LEFT_BOTTOM || key === POINT_RIGHT_BOTTOM;
        const isTop = key === POINT_TOP_CENTER || key === POINT_LEFT_TOP || key === POINT_RIGHT_TOP;

        const centerX = startRect.left + startRect.width / 2;
        const centerY = startRect.top + startRect.height / 2;

        let scaleFactor = 1;

        if (isRight || isLeft) {
          scaleFactor = 1 + dx / startRect.width;
        } else if (isBottom || isTop) {
          scaleFactor = 1 + dy / startRect.height;
        }

        const newWidth = Math.max(50, startRect.width * scaleFactor);
        const newHeight = Math.max(50, startRect.height * scaleFactor);
        const newLeft = centerX - newWidth / 2;
        const newTop = centerY - newHeight / 2;

        setRect((prev) => ({
          ...prev,
          width: newWidth,
          height: newHeight,
          left: newLeft,
          top: newTop,
        }));

        if (ref.current) {
          ref.current.style.transform = `scale(${scaleFactor})`;
          ref.current.style.transformOrigin = 'center center';
        }
      }
    };
    const handleMouseUp = () => {
      if (dragInfo && ref.current) {
        const activeItem = store.getActiveItem();
        if (activeItem) {
          if (dragInfo.mode === 'move') {
            activeItem.x = rect.left;
            activeItem.y = rect.top;
          } else if (dragInfo.mode === 'scale') {
            const prevScale = activeItem.scale || 1;
            const scaleFactor = rect.width / dragInfo.startRect.width;
            activeItem.scale = prevScale * scaleFactor;
            activeItem.x = rect.left;
            activeItem.y = rect.top;
          }
          onChange();
        }

        ref.current.style.transform = '';
        ref.current.style.transformOrigin = '';
      }
      setDragInfo(null);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragInfo, rect]);

  const handleChildMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragInfo({
      mode: 'move',
      key: null,
      startX: e.clientX,
      startY: e.clientY,
      startRect: { ...rect },
    });
    onChange();
  };

  const handlePointMouseDown = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setDragInfo({
      mode: 'scale',
      key,
      startX: e.clientX,
      startY: e.clientY,
      startRect: { ...rect },
    });
    onChange();
  };

  const ctrlElement = (
    <div className="area-move">
      <ul
        className="ctrl-container"
        onMouseDown={handleChildMouseDown}
        style={{
          position: 'absolute',
          width: rect.width,
          left: rect.left,
          top: rect.top,
          height: rect.height,
        }}
      >
        <li className="line t">
          <span
            className="point tc"
            data-key={POINT_TOP_CENTER}
            onMouseDown={(e) => handlePointMouseDown(e, POINT_TOP_CENTER)}
            style={{ cursor: 'ns-resize' }}
          />
        </li>
        <li className="line b">
          <span
            className="point bc"
            data-key={POINT_BOTTOM_CENTER}
            onMouseDown={(e) => handlePointMouseDown(e, POINT_BOTTOM_CENTER)}
            style={{ cursor: 'ns-resize' }}
          />
        </li>
        <li className="line l">
          <span
            className="point lc"
            data-key={POINT_LEFT_CENTER}
            onMouseDown={(e) => handlePointMouseDown(e, POINT_LEFT_CENTER)}
            style={{ cursor: 'ew-resize' }}
          />
          <span
            className="point lt"
            data-key={POINT_LEFT_TOP}
            onMouseDown={(e) => handlePointMouseDown(e, POINT_LEFT_TOP)}
            style={{ cursor: 'nwse-resize' }}
          />
          <span
            className="point lb"
            data-key={POINT_LEFT_BOTTOM}
            onMouseDown={(e) => handlePointMouseDown(e, POINT_LEFT_BOTTOM)}
            style={{ cursor: 'nesw-resize' }}
          />
        </li>
        <li className="line r">
          <span
            className="point rc"
            data-key={POINT_RIGHT_CENTER}
            onMouseDown={(e) => handlePointMouseDown(e, POINT_RIGHT_CENTER)}
            style={{ cursor: 'ew-resize' }}
          />
          <span
            className="point rt"
            data-key={POINT_RIGHT_TOP}
            onMouseDown={(e) => handlePointMouseDown(e, POINT_RIGHT_TOP)}
            style={{ cursor: 'nesw-resize' }}
          />
          <span
            className="point rb"
            data-key={POINT_RIGHT_BOTTOM}
            onMouseDown={(e) => handlePointMouseDown(e, POINT_RIGHT_BOTTOM)}
            style={{ cursor: 'nwse-resize' }}
          />
        </li>
        <li className="line link-rotate" />
        <li
          className="point rotate"
          data-key={POINT_ROTATE}
        />
      </ul>
    </div>
  );

  const activeItem = store.getActiveItem();
  const scale = activeItem?.scale || 1;

  return (
    <>
      {
      React.cloneElement(children, {
        ref,
        style: {
          ...children.props.style,
          cursor: 'move',
        },
      })
    }
      {createPortal(ctrlElement, document.querySelector('.area-player') || document.body)}
    </>
  );
}

export default Move;
