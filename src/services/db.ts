export class Database {
    private db: D1Database;

    constructor(db: D1Database) {
        this.db = db;
    }

    // 添加事务支持
    async transaction<T>(callback: (db: D1Database) => Promise<T>): Promise<T> {
        try {
            await this.db.exec('BEGIN TRANSACTION');
            const result = await callback(this.db);
            await this.db.exec('COMMIT');
            return result;
        } catch (error) {
            await this.db.exec('ROLLBACK');
            throw error;
        }
    }

    // 优化错误处理
    async getActivities(userId: string): Promise<Activity[]> {
        try {
            const result = await this.db.prepare(`
                SELECT a.*, t.title as task_title, p.name as project_name 
                FROM activities a
                LEFT JOIN tasks t ON a.task_id = t.id
                LEFT JOIN projects p ON t.project_id = p.id
                WHERE t.user_id = ?
                ORDER BY a.start_time DESC
            `).bind(userId).all();

            if (!result.success) {
                throw new Error('Failed to fetch activities');
            }

            return result.results as Activity[];
        } catch (error) {
            console.error('Database error:', error);
            throw new Error('数据库查询失败');
        }
    }

    // 添加新的数据访问方法
    async getTasksByPriority(userId: string, priority: string): Promise<Task[]> {
        const result = await this.db.prepare(`
            SELECT * FROM tasks 
            WHERE user_id = ? AND priority = ?
            ORDER BY created_at DESC
        `).bind(userId, priority).all();
        return result.results as Task[];
    }

    async updateTaskStatus(taskId: string, status: string, userId: string): Promise<void> {
        await this.db.prepare(`
            UPDATE tasks 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? AND user_id = ?
        `).bind(status, taskId, userId).run();
    }

    // ... 现有的其他方法 ...
}