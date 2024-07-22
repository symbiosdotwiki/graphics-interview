// src/Draggable.tsx
import React, { useRef } from 'react';

interface DraggableProps {
  children: React.ReactNode;
  onDrag: (e: MouseEvent, data: { x: number, y: number }) => void;
  position: { x: number; y: number };
}

const Draggable: React.FC<DraggableProps> = ({ children, onDrag, position }) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const node = nodeRef.current;
    if (!node) return;

    const startX = e.clientX - node.getBoundingClientRect().left;
    const startY = e.clientY - node.getBoundingClientRect().top;

    const handleMouseMove = (e: MouseEvent) => {
      onDrag(e, {
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={nodeRef}
      style={{ position: 'absolute', left: position.x, top: position.y, cursor: 'pointer' }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

export default Draggable;