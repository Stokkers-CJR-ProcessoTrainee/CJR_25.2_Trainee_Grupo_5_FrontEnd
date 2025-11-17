'use client';
import React, { useEffect, useRef, useState } from 'react';

interface VerticalCarrosselProps {
  children: React.ReactNode;
  className?: string;
}

export default function VerticalCarrossel({ children, className = '' }: VerticalCarrosselProps) {
  const carrosselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [dragged, setDragged] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carrosselRef.current) return;
    setIsDragging(true);
    setStartY(e.pageY - carrosselRef.current.offsetTop);
    setScrollTop(carrosselRef.current.scrollTop);
    setDragged(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carrosselRef.current) return;
    e.preventDefault();

    const y = e.pageY - carrosselRef.current.offsetTop;
    const walk = y - startY;

    if (Math.abs(walk) > 5) setDragged(true);

    carrosselRef.current.scrollTop = scrollTop - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleClickCapture = (e: React.MouseEvent) => {
    if (dragged) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const handleDragStart = (e: React.DragEvent) => e.preventDefault();

  useEffect(() => {
    const handleMouseUpWindow = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUpWindow);
    return () => window.removeEventListener('mouseup', handleMouseUpWindow);
  }, []);

  return (
    <div
      ref={carrosselRef}
      className={`flex flex-col overflow-y-auto gap-4 scrollbar-hide scroll-snap-y select-none ${className}`}
      style={{
        scrollSnapType: 'y mandatory',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClickCapture={handleClickCapture}
      onDragStart={handleDragStart}
    >
      {children}
    </div>
  );
}
