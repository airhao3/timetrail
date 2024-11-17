export class ActivityService {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    // 添加数据一致性检查
    async validateActivity(activity: Partial<Activity>): Promise<boolean> {
        try {
            // 检查项目是否存在
            if (activity.projectId) {
                const project = await this.db.prepare(
                    'SELECT id FROM projects WHERE id = ?'
                ).bind(activity.projectId).first();
                
                if (!project) {
                    throw new Error('项目不存在');
                }
            }

            // 验证时间数据
            if (activity.timeSpent && activity.timeSpent < 0) {
                throw new Error('时间不能为负数');
            }

            // 验证成本数据
            if (activity.cost && activity.cost < 0) {
                throw new Error('成本不能为负数');
            }

            return true;
        } catch (error) {
            console.error('活动验证失败:', error);
            return false;
        }
    }

    async createActivity(activity: Omit<Activity, 'id'>): Promise<Activity> {
        // 验证数据
        const isValid = await this.validateActivity(activity);
        if (!isValid) {
            throw new Error('活动数据验证失败');
        }

        return await this.db.transaction(async (db) => {
            // ... 创建活动的逻辑
        });
    }
} 