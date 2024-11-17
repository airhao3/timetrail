export const storage = {
    saveProjects(projects: Project[]) {
        localStorage.setItem('timetrail_projects', JSON.stringify(projects));
    },

    getProjects(): Project[] {
        const data = localStorage.getItem('timetrail_projects');
        return data ? JSON.parse(data) : [];
    },

    saveActivities(activities: Activity[]) {
        try {
            if (!Array.isArray(activities)) {
                throw new Error('Invalid activities data');
            }
            localStorage.setItem('timetrail_activities', JSON.stringify(activities));
        } catch (error) {
            console.error('保存活动失败:', error);
            throw error;
        }
    },

    getActivities(): Activity[] {
        try {
            const data = localStorage.getItem('timetrail_activities');
            if (!data) return [];
            
            const activities = JSON.parse(data);
            if (!Array.isArray(activities)) {
                throw new Error('Invalid stored activities data');
            }
            
            // 验证数据结构
            const validActivities = activities.filter(activity => 
                activity &&
                typeof activity.id === 'string' &&
                typeof activity.title === 'string' &&
                typeof activity.projectId === 'string'
            );
            
            return validActivities;
        } catch (error) {
            console.error('获取活动失败:', error);
            // 如果数据损坏，清除存储
            localStorage.removeItem('timetrail_activities');
            return [];
        }
    }
}; 