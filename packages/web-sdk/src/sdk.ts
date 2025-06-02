import { PackageInfo, SDKConfig } from './types';
import { parseQuery, checkWhiteScreen, isHotfixRequired } from './utils';

export class HybridSDK {
  private static instance: HybridSDK;

  public static getInstance(config?: SDKConfig): HybridSDK {
    if (!HybridSDK.instance && config) {
      HybridSDK.instance = new HybridSDK(config);
    }
    return HybridSDK.instance;
  }

  private config: SDKConfig;
  private packageInfo: PackageInfo | null = null;
  private initialized = false;

  private constructor(config: SDKConfig) {
    this.config = config;
    this.setupErrorHandler();
    this.setupWhiteScreenDetection();
  }

  public async init(): Promise<PackageInfo | null> {
    if (this.initialized) {
      return this.packageInfo;
    }

    try {
      const query = parseQuery(window.location.search);
      const apiKey = query.apiKey || this.config.apiKey;

      if (!apiKey) {
        throw new Error('API key is required');
      }

      const response = await fetch(
        `${this.config.apiUrl}/api/native/packages?platform=${this.config.platform}&version=${this.config.version}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch package info: ${response.statusText}`);
      }

      const data = await response.json();
      this.packageInfo = data.data;
      this.initialized = true;

      // 检查是否需要立即刷新页面
      void this.checkAndReload();

      return this.packageInfo;
    } catch (error) {
      console.error('Failed to initialize HybridSDK:', error);
      return null;
    }
  }

  private setupErrorHandler(): void {
    window.addEventListener('error', (event) => {
      // 检查是否是 404 错误
      if (event.error?.message?.includes('404') || (event.target as HTMLElement)?.tagName === 'LINK') {
        void this.checkAndReload();
      }
    });
  }

  private setupWhiteScreenDetection(): void {
    // 页面加载完成后检查白屏
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (checkWhiteScreen()) {
          void this.checkAndReload();
        }
      }, 2000); // 延迟2秒检查，确保页面有足够时间渲染
    });
  }

  private async checkAndReload(): Promise<void> {
    try {
      // 检查当前 URL 是否已经包含 reload 参数
      const query = parseQuery(window.location.search);
      if (query.reload) {
        return; // 防止无限刷新
      }

      // 检查是否需要热更新
      const needHotfix = await isHotfixRequired(
        `${this.config.apiUrl}/api/hotfix`,
        this.config.platform,
        this.config.version,
        this.packageInfo?.packageVersion,
      );

      if (needHotfix) {
        const url = new URL(window.location.href);
        url.searchParams.set('reload', 'true');
        window.location.href = url.toString();
      }
    } catch (error) {
      console.error('Failed to check hotfix:', error);
    }
  }
}
