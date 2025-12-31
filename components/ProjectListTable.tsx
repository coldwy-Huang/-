
import React from 'react';
import { Project, ProjectStatus } from '../types';
import { Edit2, ExternalLink } from 'lucide-react';

interface ProjectListTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
}

const ProjectListTable: React.FC<ProjectListTableProps> = ({ projects, onEdit }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">用例方向</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">项目内容描述</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">业务负责人</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">状态</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">阶段数</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">{project.useCase}</span>
                  <span className="text-[10px] text-blue-600 font-semibold">{project.module}</span>
                </div>
              </td>
              <td className="px-6 py-4 max-w-xs">
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {project.content || '暂无内容描述'}
                </p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-xs font-medium text-gray-700">{project.businessLead}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold border ${
                  project.overallStatus === ProjectStatus.COMPLETED 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                }`}>
                  {project.overallStatus}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                  {project.phases.length}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button 
                  onClick={() => onEdit(project)}
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-bold transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  编辑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectListTable;
