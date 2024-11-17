import { useState, useEffect } from 'react';
import { Activity } from '../types';
import { storage } from '../services/storage';

export function useActivityState(initialActivities: Activity[]) {
    const [activities, setActivities] = useState<Activity[]>(() => {
        try {
            const saved = storage.getActivities();
            return saved.length ? saved : initialActivities;
        } catch (error) {
            console.error('初始化活动失败:', error);
            return initialActivities;
        }
    });

    useEffect(() => {
        try {
            storage.saveActivities(activities);
        } catch (error) {
            console.error('保存活动失败:', error);
        }
    }, [activities]);

    const addActivity = (newActivity: Omit<Activity, 'id' | 'date'>) => {
        const activity: Activity = {
            ...newActivity,
            id: (activities.length + 1).toString(),
            date: new Date().toISOString(),
        };
        
        setActivities(prev => [activity, ...prev]);
    };

    const updateActivity = (id: string, updates: Partial<Activity>) => {
        setActivities(prev => 
            prev.map(activity => 
                activity.id === id 
                    ? { ...activity, ...updates }
                    : activity
            )
        );
    };

    const deleteActivity = (id: string) => {
        setActivities(prev => prev.filter(activity => activity.id !== id));
    };

    return {
        activities,
        addActivity,
        updateActivity,
        deleteActivity
    };
} 