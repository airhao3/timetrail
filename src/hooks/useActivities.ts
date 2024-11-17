import { useState, useEffect, useCallback } from 'react';
import { Activity } from '../types';
import { storage } from '../services/storage';
import { debug } from '../utils/debug';

export function useActivities() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // 加载活动数据
    const loadActivities = useCallback(async () => {
        try {
            setLoading(true);
            // 先从本地存储加载
            const localActivities = storage.getActivities();
            setActivities(localActivities);

            // 然后从服务器获取最新数据
            const response = await fetch('/api/activities');
            if (!response.ok) {
                throw new Error('获取活动数据失败');
            }

            const serverActivities = await response.json();
            setActivities(serverActivities);
            
            // 更新本地存储
            storage.saveActivities(serverActivities);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('未知错误'));
            debug.error('加载活动失败:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // 添加新活动
    const addActivity = useCallback(async (newActivity: Omit<Activity, 'id'>) => {
        try {
            const response = await fetch('/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newActivity)
            });

            if (!response.ok) {
                throw new Error('添加活动失败');
            }

            const savedActivity = await response.json();
            setActivities(prev => [savedActivity, ...prev]);
            storage.saveActivities([savedActivity, ...activities]);
            
            return savedActivity;
        } catch (err) {
            debug.error('添加活动失败:', err);
            throw err;
        }
    }, [activities]);

    useEffect(() => {
        loadActivities();
    }, [loadActivities]);

    return {
        activities,
        loading,
        error,
        addActivity,
        reloadActivities: loadActivities
    };
} 