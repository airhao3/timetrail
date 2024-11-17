export const debug = {
    enabled: process.env.NODE_ENV === 'development',

    log(...args: any[]) {
        if (this.enabled) {
            console.log('[TimeTrail Debug]', ...args);
        }
    },

    error(...args: any[]) {
        if (this.enabled) {
            console.error('[TimeTrail Error]', ...args);
        }
    },

    measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
        if (!this.enabled) return fn();

        const start = performance.now();
        return fn().finally(() => {
            const duration = performance.now() - start;
            this.log(`${name} took ${duration.toFixed(2)}ms`);
        });
    },

    clearStorage() {
        localStorage.clear();
        console.log('存储已清除');
    },

    inspectStorage() {
        const activities = localStorage.getItem('timetrail_activities');
        const projects = localStorage.getItem('timetrail_projects');
        console.log({
            activities: activities ? JSON.parse(activities) : null,
            projects: projects ? JSON.parse(projects) : null
        });
    }
}; 