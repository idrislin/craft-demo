import React, { useEffect, useRef, useState } from 'react';
import { useImmer } from 'use-immer';

import { worldData } from './worldData';

const INCREASE = 4; //- 提高分辨率 放大 4 倍， 4k 分辨率： 3,840 x 2,160；
const SHAPE_SIZE = 5;
const CANVAS_OFFSET = 5;
const MAX_ZOOM = 5;
const MIN_ZOOM = 1;
const ZOOM_RATIO = 0.05;

interface Pin {
  x: number;
  y: number;
  id: string;
  icon?: string;
  title?: string;
}

type Shape =
  | 'round'
  | 'square'
  | 'triangle'
  | 'diamond'
  | 'pentagon'
  | 'hexagon';

interface MapChartProps {
  colors?: { highlight?: string; base?: string };
}

const MapChart: React.FC<MapChartProps> = (props) => {
  const { colors } = props;
  const highLightColor = colors?.highlight || '#4D8359';
  const baseColor = colors?.base || '#E3E3DF';

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useImmer(worldData);
  //- 标记位置信息
  const [pinPosition, setPinPosition] = useImmer<Pin[]>([]);

  //- 控制鼠标滑轮放大
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);
  //- 控制拖拽偏移量
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const translateRef = useRef({ x: 0, y: 0 });
  //- 判断是否处于拖拽状态
  const [isDragging, setIsDragging] = useState(false);
  //- 记录鼠标位置
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState(0);
  //- 鼠标移动距离的阈值,单位为像素
  const clickThreshold = 5;
  //- 时间阈值,单位为毫秒
  const timeThreshold = 200;

  //- 当前的指针列表
  const [pointers, setPointers] = useState<React.PointerEvent[]>([]);
  //- 双指初始距离
  const [initialDistance, setInitialDistance] = useState<number | null>(null);

  const [activePin, setActivePin] = useImmer<null | Pin>(null);

  //- 限制拖拽偏移量
  const limitTranslate = (prevOffset: { x: number; y: number }) => {
    if (!canvasRef.current) return prevOffset;
    const maxTranslateX =
      canvasRef.current.width * scaleRef.current - canvasRef.current.width;
    const maxTranslateY =
      canvasRef.current.height * scaleRef.current - canvasRef.current.height;

    return {
      x: Math.min(0, Math.max(prevOffset.x, -maxTranslateX)),
      y: Math.min(0, Math.max(prevOffset.y, -maxTranslateY)),
    };
  };

  //- 点击高亮元素,alt + 点击 添加 pin
  const onCanvasClick = (x: number, y: number, altKey: boolean) => {
    if (isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    //* 鼠标点击位置 = 点击的位置 - 画布左/上距离窗口的距离
    const mouseX = x - canvasRect.left;
    const mouseY = y - canvasRect.top;

    /**
     * mouseX: 鼠标点击位置
     * canvasRect.width: 画布元素（DOM 节点）宽度
     * ! mouseX / canvasRect.width => 点击位置在画布的比例
     * translate.x: 拖动偏移量
     * canvas.width: 画布宽度（这里是画布的宽度,不是画布元素宽度,值为 4016）
     * ! translate.x / canvas.width => 偏移量对于画布的比例
     * 1004: 原始画布宽度（画布比例经过放大去适配4k,这里使用原始宽度：1004）
     * scale: 缩放倍数
     */
    const offsetX =
      ((mouseX / canvasRect.width - translate.x / canvas.width) * 1004) / scale;
    const offsetY =
      ((mouseY / canvasRect.height - translate.y / canvas.height) * 540) /
      scale;

    //- alt + click
    if (altKey) {
      setPinPosition((draft) => {
        draft.push({
          x: (offsetX / 1004) * 100,
          y: (offsetY / 540) * 100,
          id: pinPosition.length.toString(),
        });
      });
    } else {
      //- only click
      const newRectangles = data.map((rect) => {
        const positionX = [rect.x, rect.x + SHAPE_SIZE];
        const positionY = [rect.y, rect.y + SHAPE_SIZE];

        const targetNode =
          offsetX >= positionX[0] + CANVAS_OFFSET &&
          offsetX <= positionX[1] + CANVAS_OFFSET &&
          offsetY >= positionY[0] + CANVAS_OFFSET &&
          offsetY <= positionY[1] + CANVAS_OFFSET;
        if (targetNode) {
          return { ...rect, isHighLight: !rect.isHighLight };
        } else return rect;
      });
      setData(newRectangles);
    }
  };

  const drawPolygon = (
    ctx: CanvasRenderingContext2D,
    sider: number,
    x: number,
    y: number,
    angleOffset?: number
  ) => {
    ctx.beginPath();
    for (let i = 0; i < sider; i++) {
      const angle = (i * 2 * Math.PI) / sider + (angleOffset ?? 0);
      const xx = x + 3 * INCREASE * scale * Math.cos(angle);
      const yy = y + 3 * INCREASE * scale * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(xx, yy);
      } else {
        ctx.lineTo(xx, yy);
      }
    }
    ctx.closePath();
  };

  const drawShape = (
    nodeShape: Shape,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isHighLight?: boolean
  ) => {
    if (nodeShape === 'round') {
      ctx.beginPath();
      ctx.arc(x, y, 3 * INCREASE * scale, 0, Math.PI * 2);
      ctx.closePath();
    } else if (nodeShape === 'square') {
      ctx.fillStyle = isHighLight ? highLightColor : baseColor;
      ctx.fillRect(
        x,
        y,
        SHAPE_SIZE * INCREASE * scale,
        SHAPE_SIZE * INCREASE * scale
      );
      return;
    } else if (nodeShape === 'triangle' || nodeShape === 'pentagon') {
      drawPolygon(ctx, nodeShape === 'triangle' ? 3 : 5, x, y, -Math.PI / 2);
    } else if (nodeShape === 'diamond') {
      drawPolygon(ctx, 4, x, y);
    } else if (nodeShape === 'hexagon') {
      drawPolygon(ctx, 6, x, y, 10);
    }
    ctx.fillStyle = isHighLight ? highLightColor : baseColor;
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    const tran = limitTranslate(translate);
    ctx.translate(tran.x, tran.y);

    data.forEach(({ x, y, isHighLight }) => {
      ctx.fillStyle = isHighLight ? highLightColor : baseColor;
      drawShape(
        'hexagon',
        ctx,
        (x + CANVAS_OFFSET) * INCREASE * scale,
        (y + CANVAS_OFFSET) * INCREASE * scale,
        isHighLight
      );
    });
    ctx.scale(scale, scale);
    ctx.restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, scale, translate]);

  //- 滚轮缩放
  useEffect(() => {
    function onWheel(this: HTMLCanvasElement, ev: WheelEvent) {
      ev.preventDefault();
      scaleRef.current = Math.max(
        MIN_ZOOM,
        Math.min(
          (ev.deltaY > 0
            ? scaleRef.current * 1000 - ZOOM_RATIO * 1000
            : scaleRef.current * 1000 + ZOOM_RATIO * 1000) / 1000,
          MAX_ZOOM
        )
      );
      setScale(scaleRef.current);
    }
    const canvasDom = canvasRef.current;
    if (!canvasDom) return;
    canvasDom.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      canvasDom.removeEventListener('wheel', onWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);

  //- 鼠标按下
  const onPointerDown = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    setPointers((prev) => [...prev, ev]);
    setStartPos({ x: ev.clientX, y: ev.clientY });
    setStartTime(new Date().getTime());
  };

  //- 计算两指间的距离
  const getDistance = (
    pointer1: React.PointerEvent,
    pointer2: React.PointerEvent
  ) => {
    const dx = pointer2.clientX - pointer1.clientX;
    const dy = pointer2.clientY - pointer1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  //- 鼠标移动
  const onPointerMove = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    if (!startTime) return;
    setPointers((prevPointers) =>
      prevPointers.map((p) => (p.pointerId === ev.pointerId ? ev : p))
    );

    setStartPos({ x: ev.clientX, y: ev.clientY });

    if (pointers.length === 2) {
      // 检测到双指操作
      const [pointer1, pointer2] = pointers;

      const currentDistance = getDistance(pointer1, pointer2);
      //! 快速连续拖拽时 state 未能及时同步导致 NaN
      if (isNaN(currentDistance)) return;
      if (initialDistance !== null && !isNaN(initialDistance)) {
        const distanceDiff = currentDistance - initialDistance;
        //! 计算缩放增量，每移动 30 像素，调整缩放比例
        if (Math.abs(distanceDiff) >= 30) {
          const scaleChange = distanceDiff > 0 ? ZOOM_RATIO : -ZOOM_RATIO;
          scaleRef.current = Math.max(
            MIN_ZOOM,
            Math.min(
              (scaleRef.current * 1000 + scaleChange * 1000) / 1000,
              MAX_ZOOM
            )
          );
          setScale(scaleRef.current);
          setInitialDistance(currentDistance); // 重置初始距离
        }
      } else {
        setInitialDistance(currentDistance);
      }
    } else {
      if (!canvasRef.current) return;
      const distance = Math.sqrt(
        Math.pow(ev.clientX - startPos.x, 2) +
          Math.pow(ev.clientY - startPos.y, 2)
      );

      if (distance > clickThreshold) {
        setIsDragging(true); // 如果移动距离大于阈值,标记为拖拽
      }

      //* 处理拖拽
      const dx = ev.clientX - startPos.x;
      const dy = ev.clientY - startPos.y;

      //TODO: 移动端 & PC 端区分处理
      translateRef.current = limitTranslate({
        x: translateRef.current.x + dx * (window.innerWidth <= 600 ? 10 : 1),
        y: translateRef.current.y + dy * (window.innerWidth <= 600 ? 10 : 1),
      });
      // setValue(dx);
      setTranslate(translateRef.current);

      setStartPos({ x: ev.clientX, y: ev.clientY });
    }
  };

  //- 鼠标抬起
  const onPointerUp = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    setPointers([]);
    setInitialDistance(null);
    setIsDragging(false);
    setStartTime(0);

    const endTime = new Date().getTime();
    const timeElapsed = endTime - startTime;
    //* 如果移动距离小于阈值,并且时间小于阈值,认定为点击
    if (!isDragging && timeElapsed < timeThreshold && pointers.length < 2) {
      onCanvasClick(ev.clientX, ev.clientY, ev.altKey);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute bottom-0 left-0 text-white bg-gray-300 select-none min-w-10">
        {scale}
      </div>
      <div className="absolute bottom-0 right-0 text-white bg-gray-300 select-none min-w-10">
        {JSON.stringify(translate)}
      </div>
      <canvas
        ref={canvasRef}
        width={1004 * INCREASE}
        height={540 * INCREASE}
        className="w-full h-full"
        onPointerUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
      />
      {activePin ? (
        <div
          className="absolute -translate-x-1/2 -translate-y-20 z-[100] text-white flex items-center font-semibold px-4 py-2 bg-[#1a1c1a] rounded-lg"
          style={{
            left: `calc(${activePin.x * scale}% + ${
              (translate.x / 4016) * 100
            }%)`,
            top: `calc(${activePin.y * scale}% + ${
              (translate.y / 2160) * 100
            }%)`,
          }}
        >
          {activePin.id}
        </div>
      ) : null}
      {pinPosition?.map((pin, i) => (
        <div
          id={pin.id}
          key={`${pin.x}-${pin.y}`}
          className="w-7 h-11 absolute -translate-x-1/2 -translate-y-full drop-shadow-[4px_16px_6px_rgba(0,0,10,0.2)]"
          style={{
            left: `calc(${pin.x * scale}% + ${(translate.x / 4016) * 100}%)`,
            top: `calc(${pin.y * scale}% + ${(translate.y / 2160) * 100}%)`,
            zIndex: activePin?.id === pin.id ? 999 : 99,
            color: activePin?.id === pin.id ? highLightColor : baseColor,
          }}
          onDoubleClick={() => {
            setPinPosition((draft) => {
              draft.splice(i, 1);
            });
            setActivePin(null);
          }}
          onClick={(ev) => {
            ev.stopPropagation();
            if (pin.id === activePin?.id) return;
            setActivePin(pin);
          }}
        >
          <svg
            version="1.1"
            viewBox="0 0 30 44"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentcolor"
              d="m29.29,14.89q0,7.87 -14.3,28.94q-14.29,-21.07 -14.29,-28.94c0,-7.88 6.4,-14.26 14.29,-14.26c7.9,0 14.3,6.38 14.3,14.26z"
            />
            <ellipse rx="7.06" ry="7.06" cx="14.82" cy="14.75" fill="#FFF8F4" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default MapChart;
