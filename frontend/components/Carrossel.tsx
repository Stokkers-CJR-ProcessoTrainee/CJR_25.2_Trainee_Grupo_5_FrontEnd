'use client';
import React, { useEffect, useRef, useState } from 'react';

interface CarrosselProps {
  children: React.ReactNode;
}

export default function Carrossel({ children }: CarrosselProps) {
  const carrosselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carrosselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carrosselRef.current.offsetLeft);
    setScrollLeft(carrosselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carrosselRef.current) return;
    e.preventDefault(); 
    const x = e.pageX - carrosselRef.current.offsetLeft;
    const walk = x - startX;
    carrosselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={carrosselRef}
      className="flex overflow-x-auto gap-6 scrollbar-hide scroll-snap-x select-none"
      style={{
        scrollSnapType: 'x mandatory',
        cursor: 'default',
        userSelect: 'none', 
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragStart={handleDragStart} 
    >
      {children}
    </div>
  );
}