CREATE TABLE IF NOT EXISTS task_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    action_type TEXT NOT NULL CHECK(action_type IN ('create', 'update', 'complete', 'extend', 'comment')),
    changed_fields TEXT CHECK(json_valid(changed_fields)), -- 验证JSON格式
    old_value TEXT CHECK(json_valid(old_value)),          -- 验证JSON格式
    new_value TEXT CHECK(json_valid(new_value)),          -- 验证JSON格式
    comment TEXT,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 添加索引优化查询性能
CREATE INDEX idx_task_history_task_id ON task_history(task_id);
CREATE INDEX idx_task_history_created_at ON task_history(created_at); 