import React from 'react';
import { Timeline } from 'antd';
import { ClockCircleOutlined, EditOutlined, CheckOutlined, CommentOutlined } from '@ant-design/icons';
import { TaskHistory as TaskHistoryType } from '../../types';
import styles from './styles.module.css';

interface TaskHistoryProps {
    history: TaskHistoryType[];
}

export const TaskHistory: React.FC<TaskHistoryProps> = ({ history }) => {
    const getIcon = (actionType: string) => {
        switch (actionType) {
            case 'create': return <ClockCircleOutlined />;
            case 'update': return <EditOutlined />;
            case 'complete': return <CheckOutlined />;
            case 'comment': return <CommentOutlined />;
            default: return null;
        }
    };

    const formatHistoryItem = (item: TaskHistoryType) => {
        switch (item.action_type) {
            case 'create':
                return '创建了任务';
            case 'update':
                const fields = JSON.parse(item.changed_fields || '[]');
                return `更新了 ${fields.join(', ')}`;
            case 'complete':
                return '完成了任务';
            case 'comment':
                return `添加了评论: ${item.comment}`;
            default:
                return '';
        }
    };

    return (
        <Timeline className={styles.timeline}>
            {history.map(item => (
                <Timeline.Item 
                    key={item.id}
                    dot={getIcon(item.action_type)}
                >
                    <div className={styles.historyItem}>
                        <p>{formatHistoryItem(item)}</p>
                        <small>{new Date(item.created_at).toLocaleString()}</small>
                    </div>
                </Timeline.Item>
            ))}
        </Timeline>
    );
};

export default TaskHistory; 