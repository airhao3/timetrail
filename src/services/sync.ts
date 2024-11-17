import { Database } from './db';
import { storage } from './storage';
import { debug } from '../utils/debug';

export class SyncService {
    private static instance: SyncService;
    private syncInProgress = false;
    private lastSyncTime: number = 0;
    private readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5分钟

    private constructor() {}

    static getInstance(): SyncService {
        if (!SyncService.instance) {
            SyncService.instance = new SyncService();
        }
        return SyncService.instance;
    }

    async shouldSync(): Promise<boolean> {
        if (this.syncInProgress) return false;
        if (Date.now() - this.lastSyncTime < this.SYNC_INTERVAL) return false;
        return true;
    }

    async sync(): Promise<void> {
        if (!await this.shouldSync()) return;

        try {
            this.syncInProgress = true;
            
            // 获取本地数据版本
            const localVersion = storage.getVersion();
            
            // 获取服务器数据版本
            const response = await fetch('/api/sync/version');
            const { version: serverVersion } = await response.json();

            // 如果版本不同，进行同步
            if (localVersion !== serverVersion) {
                await this.performSync();
            }

            this.lastSyncTime = Date.now();
        } catch (error) {
            debug.error('同步失败:', error);
            throw error;
        } finally {
            this.syncInProgress = false;
        }
    }

    private async performSync(): Promise<void> {
        // 实现具体的同步逻辑
    }
} 