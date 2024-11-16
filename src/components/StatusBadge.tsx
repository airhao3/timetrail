import React from 'react';
import { Activity } from '../types';
import { CheckCircle, Clock, AlertTriangle, XCircle, PlayCircle } from 'lucide-react';

const STATUS_STYLES = {
  completed: 'bg-green-100 text-green-800',
  planned: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  stuck: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const STATUS_ICONS = {
  completed: CheckCircle,
  planned: Clock,
  'in-progress': PlayCircle,
  stuck: AlertTriangle,
  cancelled: XCircle,
};

interface StatusBadgeProps {
  status: Activity['status'];
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const Icon = STATUS_ICONS[status];
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${STATUS_STYLES[status]} ${className}`}>
      <Icon className="w-4 h-4" />
      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
    </span>
  );
}