-- 为现有表添加性能优化的索引
CREATE INDEX IF NOT EXISTS idx_activities_task_id ON activities(task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- 添加任务优先级
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority TEXT 
CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium'; 