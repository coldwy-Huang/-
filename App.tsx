
import React, { useState, useCallback } from 'react';
import { Project, ProjectStatus } from './types';
import { INITIAL_PROJECTS } from './constants';
import TimelineHeader from './components/TimelineHeader';
import ProjectRow from './components/ProjectRow';
import ProjectModal from './components/ProjectModal';
import ProjectListTable from './components/ProjectListTable';
import { Plus, LayoutGrid, Calendar, ListTodo, Move } from 'lucide-react';

type ViewMode = 'timeline' | 'list';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
  }, []);

  const handleSaveProject = (projectData: Project) => {
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === projectData.id ? projectData : p));
    } else {
      setProjects(prev => [...prev, projectData]);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleDragStartPhase = (e: React.DragStartEvent) => {
    e.dataTransfer.setData('type', 'NEW_PHASE');
    e.dataTransfer.effectAllowed = 'copy';
  };

  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.overallStatus === ProjectStatus.COMPLETED).length,
    inProgress: projects.filter(p => p.overallStatus === ProjectStatus.IN_PROGRESS).length,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <LayoutGrid className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">智能项目管理看板</h1>
            <p className="text-xs font-medium text-gray-400">Intelligent Project Timeline Manager</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              总计: {stats.total}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              已完成: {stats.completed}
            </div>
          </div>
          
          <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
            {/* Draggable New Phase Button */}
            <div 
              draggable="true"
              onDragStart={handleDragStartPhase}
              className="group relative flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl text-sm font-bold border border-blue-200 cursor-grab active:cursor-grabbing hover:bg-blue-100 transition-all"
            >
              <Move className="w-4 h-4" />
              <span>新增阶段</span>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                拖拽至下方时间轴
              </div>
            </div>

            <button 
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-4 h-4" />
              新建项目
            </button>
          </div>
        </div>
      </nav>

      <main className="p-8">
        {/* Workspace Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs font-bold ${
                viewMode === 'timeline' 
                ? 'bg-white shadow-sm text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              2026年度时间轴 (1-12月)
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs font-bold ${
                viewMode === 'list' 
                ? 'bg-white shadow-sm text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              列表视图
            </button>
          </div>
          
          <div className="text-[10px] text-gray-400 font-medium">
            提示：1. 拖拽上方“新增阶段”到项目行 2. 双击阶段标签可重命名 3. 拖拽边缘可调整长宽及位置
          </div>
        </div>

        {/* Main Board Container */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {viewMode === 'timeline' ? (
            <div className="overflow-x-auto">
              <div className="min-w-[1740px]"> {/* 300px + 12 * 120px = 1740px */}
                <TimelineHeader />
                <div className="bg-white">
                  {projects.map(project => (
                    <ProjectRow 
                      key={project.id} 
                      project={project} 
                      onUpdateProject={updateProject}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <ProjectListTable projects={projects} onEdit={handleEdit} />
          )}
        </div>
        
        {projects.length === 0 && (
          <div className="mt-20 flex flex-col items-center justify-center text-gray-400">
            <LayoutGrid className="w-16 h-16 opacity-10 mb-4" />
            <p className="font-medium">暂无项目，点击上方“新建项目”开始</p>
          </div>
        )}
      </main>

      {/* Project Modal */}
      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        initialProject={editingProject}
      />
    </div>
  );
};

export default App;
