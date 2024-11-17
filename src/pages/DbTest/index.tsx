import React, { useState, useEffect } from 'react';
import { Card, Button, Table, message, Spin, Divider, Input, Space } from 'antd';
import { Database } from '../../services/db';

const DbTestPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [customQuery, setCustomQuery] = useState('');

    // 测试用例列表
    const testCases = [
        {
            name: '检查所有表',
            query: "SELECT name FROM sqlite_master WHERE type='table';"
        },
        {
            name: '检查任务表结构',
            query: "PRAGMA table_info(tasks);"
        },
        {
            name: '检查活动表结构',
            query: "PRAGMA table_info(activities);"
        },
        {
            name: '检查项目表结构',
            query: "PRAGMA table_info(projects);"
        },
        {
            name: '查看所有任务',
            query: "SELECT * FROM tasks LIMIT 5;"
        },
        {
            name: '查看所有活动',
            query: "SELECT * FROM activities LIMIT 5;"
        },
        {
            name: '查看所有项目',
            query: "SELECT * FROM projects LIMIT 5;"
        },
        {
            name: '检查数据统计',
            query: `
                SELECT 
                    (SELECT COUNT(*) FROM tasks) as tasks_count,
                    (SELECT COUNT(*) FROM activities) as activities_count,
                    (SELECT COUNT(*) FROM projects) as projects_count;
            `
        }
    ];

    // 添加 SQL 注入防护
    const sanitizeQuery = (query: string): string => {
        // 移除危险的 SQL 关键字
        const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER'];
        let sanitized = query;
        dangerousKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            sanitized = sanitized.replace(regex, '');
        });
        return sanitized;
    };

    const runQuery = async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            // 验证查询语句
            if (!query.trim().toUpperCase().startsWith('SELECT')) {
                throw new Error('仅支持 SELECT 查询');
            }

            const sanitizedQuery = sanitizeQuery(query);
            const db = new Database(/* 传入数据库实例 */);
            const result = await db.rawQuery(sanitizedQuery);
            setResults(Array.isArray(result) ? result : [result]);
            message.success('查询执行成功');
        } catch (err) {
            setError(err instanceof Error ? err.message : '查询执行失败');
            message.error('查询执行失败');
        } finally {
            setLoading(false);
        }
    };

    const columns = results[0] ? Object.keys(results[0]).map(key => ({
        title: key,
        dataIndex: key,
        key: key,
        render: (text: any) => JSON.stringify(text)
    })) : [];

    return (
        <div className="p-6">
            <Card title="数据库测试面板">
                <Space direction="vertical" style={{ width: '100%' }}>
                    {/* 自定义查询 */}
                    <Card size="small" title="自定义查询">
                        <Input.TextArea 
                            value={customQuery}
                            onChange={e => setCustomQuery(e.target.value)}
                            placeholder="输入 SQL 查询语句"
                            rows={4}
                        />
                        <Button 
                            type="primary"
                            onClick={() => runQuery(customQuery)}
                            disabled={!customQuery}
                            style={{ marginTop: 16 }}
                        >
                            执行查询
                        </Button>
                    </Card>

                    {/* 预设测试用例 */}
                    <Card size="small" title="预设测试">
                        <Space wrap>
                            {testCases.map((test, index) => (
                                <Button 
                                    key={index}
                                    onClick={() => runQuery(test.query)}
                                >
                                    {test.name}
                                </Button>
                            ))}
                        </Space>
                    </Card>

                    {/* 查询结果 */}
                    <Card size="small" title="查询结果">
                        {loading ? (
                            <div className="text-center p-4">
                                <Spin tip="执行查询中..." />
                            </div>
                        ) : error ? (
                            <div className="text-red-500 p-4">
                                错误: {error}
                            </div>
                        ) : (
                            <Table 
                                dataSource={results}
                                columns={columns}
                                rowKey={(record, index) => index.toString()}
                                scroll={{ x: true }}
                            />
                        )}
                    </Card>
                </Space>
            </Card>
        </div>
    );
};

export default DbTestPage; 