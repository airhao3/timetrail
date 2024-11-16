import React from 'react';
import { Clock, DollarSign, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Activity, Project } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ActivityCardProps {
  activity: Activity;
  project: Project;
}

export function ActivityCard({ activity, project }: ActivityCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {activity.imageUrl && (
        <img
          src={activity.imageUrl}
          alt={activity.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <span className="text-sm font-medium text-gray-600">
            {project.name}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
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
              <span>Link</span>
            </a>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            activity.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {activity.status === 'completed' ? 'Completed' : 'Planned'}
          </span>
        </div>
      </div>
    </div>
  );
}