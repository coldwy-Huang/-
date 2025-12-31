
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { PhaseInstance, PhaseStatus } from '../types';
import { CheckCircle, Clock, Edit3 } from 'lucide-react';

interface PhaseTagProps {
  phase: PhaseInstance;
  containerWidth: number;
  onUpdate: (id: string, updates: Partial<PhaseInstance>) => void;
  onDelete: (id: string) => void;
}

const PhaseTag: React.FC<PhaseTagProps> = ({ phase, containerWidth, onUpdate, onDelete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizingWidth, setIsResizingWidth] = useState(false);
  const [isResizingHeight, setIsResizingHeight] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(phase.name);
  const tagRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ROW_HEIGHT = 70;

  const handleMouseDown = (e: React.MouseEvent, type: 'drag' | 'resizeWidth' | 'resizeHeight') => {
    if (isEditing) return;
    e.stopPropagation();
    if (type === 'drag') setIsDragging(true);
    if (type === 'resizeWidth') setIsResizingWidth(true);
    if (type === 'resizeHeight') setIsResizingHeight(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizingWidth && !isResizingHeight) return;

    const parent = tagRef.current?.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      const newOffset = Math.max(0, Math.min(x - phase.width / 2, containerWidth - phase.width));
      const newTopOffset = Math.max(0, Math.min(y - phase.height / 2, ROW_HEIGHT - phase.height));
      onUpdate(phase.id, { 
        startOffset: newOffset,
        topOffset: newTopOffset
      });
    }

    if (isResizingWidth) {
      const newWidth = Math.max(40, x - phase.startOffset);
      onUpdate(phase.id, { width: Math.min(newWidth, containerWidth - phase.startOffset) });
    }

    if (isResizingHeight) {
      const boxRect = tagRef.current?.getBoundingClientRect();
      if (boxRect) {
        // Max height constrained by the row height and current top position
        const maxPossibleHeight = ROW_HEIGHT - (phase.topOffset || 0);
        const newHeight = Math.max(24, Math.min(maxPossibleHeight, (e.clientY - boxRect.top)));
        onUpdate(phase.id, { height: newHeight });
      }
    }
  }, [isDragging, isResizingWidth, isResizingHeight, phase, containerWidth, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizingWidth(false);
    setIsResizingHeight(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizingWidth || isResizingHeight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizingWidth, isResizingHeight, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const toggleStatus = () => {
    onUpdate(phase.id, {
      status: phase.status === PhaseStatus.IN_PROGRESS ? PhaseStatus.COMPLETED : PhaseStatus.IN_PROGRESS
    });
  };

  const handleStartEdit = (e: React.MouseEvent | React.FocusEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(phase.name);
  };

  const handleFinishEdit = () => {
    setIsEditing(false);
    if (editValue.trim() && editValue !== phase.name) {
      onUpdate(phase.id, { name: editValue.trim() });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleFinishEdit();
    if (e.key === 'Escape') {
      setEditValue(phase.name);
      setIsEditing(false);
    }
  };

  const statusColors = phase.status === PhaseStatus.COMPLETED 
    ? 'bg-emerald-100 border-emerald-500 text-emerald-800' 
    : 'bg-blue-100 border-blue-500 text-blue-800';

  // For backward compatibility if topOffset is missing
  const currentTop = phase.topOffset !== undefined ? phase.topOffset : (ROW_HEIGHT - (phase.height || 36)) / 2;

  return (
    <div
      ref={tagRef}
      style={{
        left: phase.startOffset,
        top: currentTop,
        width: phase.width,
        height: phase.height || 36,
        position: 'absolute'
      }}
      className={`group rounded-md border-2 transition-shadow hover:shadow-lg flex items-center px-2 z-10 select-none ${statusColors} ${isDragging ? 'opacity-70 cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={(e) => handleMouseDown(e, 'drag')}
      onDoubleClick={handleStartEdit}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); toggleStatus(); }}
        className="mr-2 hover:scale-110 transition-transform flex-shrink-0"
      >
        {phase.status === PhaseStatus.COMPLETED ? (
          <CheckCircle className="w-4 h-4 text-emerald-600" />
        ) : (
          <Clock className="w-4 h-4 text-blue-600" />
        )}
      </button>
      
      <div className="flex-grow flex items-center justify-center overflow-hidden h-full">
        {isEditing ? (
          <input
            ref={inputRef}
            className="w-full bg-white/80 border-none outline-none text-[10px] font-bold text-center rounded px-1"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleFinishEdit}
            onKeyDown={handleKeyDown}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-[10px] font-bold truncate leading-tight px-1 text-center">
            {phase.name}
          </span>
        )}
      </div>

      {!isEditing && (
        <button 
          onClick={handleStartEdit}
          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-black/5 rounded flex-shrink-0"
        >
          <Edit3 className="w-3 h-3 opacity-60" />
        </button>
      )}

      {/* Resize Handle - Right (Width) */}
      <div 
        className="absolute right-0 top-0 w-2 h-full cursor-ew-resize flex items-center justify-center group-hover:bg-black/5 transition-colors"
        onMouseDown={(e) => handleMouseDown(e, 'resizeWidth')}
      >
        <div className="w-0.5 h-1/2 bg-black/10 rounded-full group-hover:bg-black/30" />
      </div>

      {/* Resize Handle - Bottom (Height) */}
      <div 
        className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize flex items-center justify-center group-hover:bg-black/5 transition-colors"
        onMouseDown={(e) => handleMouseDown(e, 'resizeHeight')}
      >
        <div className="w-1/3 h-0.5 bg-black/10 rounded-full group-hover:bg-black/30" />
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(phase.id); }}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] items-center justify-center hidden group-hover:flex shadow-sm hover:bg-red-600 z-20"
      >
        ×
      </button>
    </div>
  );
};

export default PhaseTag;
