
import React, { useRef } from 'react';
import { Project, PhaseInstance, PhaseStatus } from '../types';
import { TIMELINE_CELL_WIDTH, TIMELINE_TOTAL_CELLS } from '../constants';
import PhaseTag from './PhaseTag';
import { Edit2 } from 'lucide-react';

interface ProjectRowProps {
  project: Project;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onEdit: (project: Project) => void;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, onUpdateProject, onEdit }) => {
  const timelineWidth = TIMELINE_CELL_WIDTH * TIMELINE_TOTAL_CELLS;
  const timelineRef = useRef<HTMLDivElement>(null);
  const ROW_HEIGHT = 70;

  const addPhase = (atX?: number, atY?: number) => {
    const defaultWidth = 120;
    const defaultHeight = 36;
    
    const newPhase: PhaseInstance = {
      id: Math.random().toString(36).substr(2, 9),
      name: '新项目阶段',
      startOffset: atX !== undefined ? atX : 50,
      topOffset: atY !== undefined ? atY : (ROW_HEIGHT - defaultHeight) / 2,
      width: defaultWidth,
      height: defaultHeight,
      status: PhaseStatus.IN_PROGRESS
    };

    onUpdateProject(project.id, {
      phases: [...project.phases, newPhase]
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Center the tag on the drop point (assuming default width 120 and height 36)
    const droppedX = Math.max(0, Math.min(x - 60, timelineWidth - 120));
    const droppedY = Math.max(0, Math.min(y - 18, ROW_HEIGHT - 36));
    
    addPhase(droppedX, droppedY);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const updatePhase = (phaseId: string, updates: Partial<PhaseInstance>) => {
    onUpdateProject(project.id, {
      phases: project.phases.map(p => p.id === phaseId ? { ...p, ...updates } : p)
    });
  };

  const deletePhase = (phaseId: string) => {
    onUpdateProject(project.id, {
      phases: project.phases.filter(p => p.id !== phaseId)
    });
  };

  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50/50 transition-colors group">
      {/* Left Sidebar Info */}
      <div className="w-[300px] flex-shrink-0 border-r border-gray-200 py-2 px-4 relative bg-white flex flex-col justify-center h-[70px]">
        <div className="flex justify-between items-center mb-0.5">
          <h3 className="text-xs font-bold text-gray-900 truncate pr-4">{project.useCase}</h3>
          <button 
            onClick={() => onEdit(project)}
            className="text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        </div>
        
        <p className="text-[10px] text-gray-500 line-clamp-1 mb-1 leading-tight">
          {project.content || '暂无内容描述'}
        </p>

        <div className="flex items-center justify-between text-[9px] text-gray-400 font-medium">
          <span className="truncate max-w-[140px]">负责: {project.businessLead}</span>
          <span className={`px-1.5 py-0.25 rounded-full border flex-shrink-0 ${
            project.overallStatus === '已完成' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}>
            {project.overallStatus}
          </span>
        </div>
      </div>

      {/* Right Timeline Grid - Removed flex items-center to allow top positioning */}
      <div 
        ref={timelineRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex-1 relative overflow-hidden h-[70px]"
      >
        {/* Grid lines */}
        <div className="absolute inset-0 flex pointer-events-none">
          {Array.from({ length: TIMELINE_TOTAL_CELLS }).map((_, i) => (
            <div 
              key={i} 
              style={{ width: TIMELINE_CELL_WIDTH }} 
              className="h-full border-r border-gray-100 flex-shrink-0"
            />
          ))}
        </div>

        {/* Phases Container */}
        <div className="relative w-full h-full">
          {project.phases.map((phase) => (
            <PhaseTag
              key={phase.id}
              phase={phase}
              containerWidth={timelineWidth}
              onUpdate={updatePhase}
              onDelete={deletePhase}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectRow;
