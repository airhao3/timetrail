import { TaskHistory } from '../types';
import { Database } from './db';

export class TaskHistoryService {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    async getTaskHistory(taskId: number): Promise<TaskHistory[]> {
        try {
            const sql = `
                SELECT 
                    th.*,
                    u.name as created_by_name
                FROM task_history th
                LEFT JOIN users u ON th.created_by = u.id
                WHERE th.task_id = ? 
                ORDER BY th.created_at DESC
            `;
            
            const result = await this.db.prepare(sql)
                .bind(taskId)
                .all();
                
            return result.results as TaskHistory[];
        } catch (error) {
            console.error('获取任务历史失败:', error);
            throw new Error('获取任务历史失败');
        }
    }

    async recordCreation(taskId: number, taskData: any, userId: number) {
        const sql = `
            INSERT INTO task_history (task_id, action_type, new_value, created_by)
            VALUES (?, ?, ?, ?)
        `;
        
        return await this.db.prepare(sql)
            .bind(taskId, 'create', JSON.stringify(taskData), userId)
            .run();
    }

    async recordUpdate(taskId: number, oldData: any, newData: any, userId: number) {
        const changedFields = this.getChangedFields(oldData, newData);
        
        // 如果没有实际变化，直接返回
        if (Object.keys(changedFields).length === 0) {
            return null;
        }

        try {
            const sql = `
                INSERT INTO task_history (
                    task_id, 
                    action_type, 
                    changed_fields, 
                    old_value, 
                    new_value, 
                    created_by
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            return await this.db.prepare(sql)
                .bind(
                    taskId,
                    'update',
                    JSON.stringify(Object.keys(changedFields)),
                    JSON.stringify(oldData),
                    JSON.stringify(newData),
                    userId
                )
                .run();
        } catch (error) {
            console.error('记录任务更新失败:', error);
            throw new Error('记录任务更新失败');
        }
    }

    private getChangedFields(oldData: any, newData: any) {
        const changes: Record<string, {old: any, new: any}> = {};
        Object.keys(newData).forEach(key => {
            if (oldData[key] !== newData[key]) {
                changes[key] = {
                    old: oldData[key],
                    new: newData[key]
                };
            }
        });
        return changes;
    }
} 