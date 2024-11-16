import React, { useState, useRef, useEffect } from 'react';
import { Activity } from '../types';
import { ChevronDown } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface StatusChangeMenuProps {
  status: Activity['status'];
  onStatusChange: (newStatus: Activity['status']) => void;
}

export function StatusChangeMenu({ status, onStatusChange }: StatusChangeMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const statuses: Activity['status'][] = ['completed', 'planned', 'in-progress', 'stuck', 'cancelled'];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:opacity-80 transition-opacity"
      >
        <StatusBadge status={status} />
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
          {statuses.map((statusOption) => (
            <button
              key={statusOption}
              onClick={() => {
                onStatusChange(statusOption);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
            >
              <StatusBadge status={statusOption} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}