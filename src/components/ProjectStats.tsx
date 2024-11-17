import React, { useMemo } from 'react';
import { Activity, Project } from '../types';
import { Clock, DollarSign, CheckCircle, Calendar } from 'lucide-react';

interface ProjectStatsProps {
  project: Project;
  activities: Activity[];
}

export function ProjectStats({ project, activities }: ProjectStatsProps) {
  if (!project || !activities) {
    console.error('ProjectStats: 缺少必要属性');
    return null;
  }

  const projectActivities = useMemo(() => 
    activities.filter(a => a.projectId === project.id),
    [activities, project.id]
  );

  const stats = useMemo(() => ({
    totalTime: projectActivities.reduce((sum, a) => sum + a.timeSpent, 0),
    totalCost: projectActivities.reduce((sum, a) => sum + a.cost, 0),
    completedCount: projectActivities.filter(a => a.status === 'completed').length,
    plannedCount: projectActivities.filter(a => a.status === 'planned').length
  }), [projectActivities]);

  if (stats.totalTime < 0 || stats.totalCost < 0) {
    console.error('ProjectStats: 无效的统计数据');
    return <div>统计数据错误</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: project.color }}
        />
        <h3 className="text-lg font-bold">{project.name}</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total Time</p>
            <p className="font-semibold">{stats.totalTime} min</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Total Cost</p>
            <p className="font-semibold">${stats.totalCost.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="font-semibold">{stats.completedCount}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Planned</p>
            <p className="font-semibold">{stats.plannedCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}