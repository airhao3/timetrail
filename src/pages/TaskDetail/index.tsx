import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import styles from './styles.module.css';

const TaskDetail: React.FC = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <Button onClick={() => navigate('/')}>
                返回首页
            </Button>
            <h2>任务详情 #{taskId}</h2>
        </div>
    );
};

export default TaskDetail; 