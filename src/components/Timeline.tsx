import React from 'react';
import { Activity, Project } from '../types';
import { formatDistanceToNow, format } from 'date-fns';
import { Clock, DollarSign, ExternalLink } from 'lucide-react';
import { StatusChangeMenu } from './StatusChangeMenu';

interface TimelineProps {
  activities: Activity[];
  projects: Project[];
  onStatusChange: (activityId: string, newStatus: Activity['status']) => void;
}

export function Timeline({ activities, projects, onStatusChange }: TimelineProps) {
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
      
      <div className="space-y-8">
        {sortedActivities.map((activity) => {
          const project = projects.find(p => p.id === activity.projectId)!;
          
          return (
            <div key={activity.id} className="relative pl-16">
              <div
                className="absolute left-[29px] w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: project.color }}
              />
              
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {project.name}
                  </span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(activity.date), 'MMM d, yyyy')}
                  </span>
                  <div className="ml-auto">
                    <StatusChangeMenu
                      status={activity.status}
                      onStatusChange={(newStatus) => onStatusChange(activity.id, newStatus)}
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{activity.title}</h3>
                
                {activity.imageUrl && (
                  <img
                    src={activity.imageUrl}
                    alt={activity.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <p className="text-gray-600 mb-4">{activity.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{activity.timeSpent} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${activity.cost.toFixed(2)}</span>
                  </div>
                  {activity.linkUrl && (
                    <a
                      href={activity.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Resource</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}