import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';

const Navigation: React.FC = () => {
    const location = useLocation();
    
    // 添加路由验证
    const isValidRoute = (path: string): boolean => {
        const validRoutes = ['/', '/db-test'];
        return validRoutes.includes(path);
    };

    const items = [
        {
            key: '/',
            label: <Link to="/">首页</Link>
        },
        {
            key: '/db-test',
            label: <Link to="/db-test">数据库测试</Link>
        }
    ].filter(item => isValidRoute(item.key));

    // 添加当前路由验证
    const currentPath = isValidRoute(location.pathname) 
        ? location.pathname 
        : '/';

    return (
        <Menu 
            mode="horizontal" 
            selectedKeys={[currentPath]}
            items={items}
        />
    );
};

export default Navigation; 