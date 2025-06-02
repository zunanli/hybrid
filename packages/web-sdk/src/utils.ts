import { QueryParams } from './types';

export function parseQuery(search: string): QueryParams {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(search);

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

export function checkWhiteScreen(): boolean {
  const { body } = document;
  const html = document.documentElement;

  // 检查页面是否为空
  if (!body || !html) {
    return true;
  }

  // 检查页面内容是否为空
  if (body.children.length === 0) {
    return true;
  }

  // 检查页面是否全白
  const bodyBg = window.getComputedStyle(body).backgroundColor;
  const htmlBg = window.getComputedStyle(html).backgroundColor;
  const isWhite = (color: string) =>
    color === 'rgb(255, 255, 255)' ||
    color === '#ffffff' ||
    color === 'white' ||
    color === 'transparent' ||
    color === 'rgba(0, 0, 0, 0)';

  return isWhite(bodyBg) && isWhite(htmlBg) && body.textContent?.trim().length === 0;
}

export async function isHotfixRequired(
  hotfixUrl: string,
  platform: string,
  appVersion: string,
  packageVersion?: string,
): Promise<boolean> {
  if (!packageVersion) {
    return false;
  }

  try {
    const response = await fetch(
      `${hotfixUrl}?platform=${platform}&appVersion=${appVersion}&packageVersion=${packageVersion}`,
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.data?.needHotfix || false;
  } catch (error) {
    console.error('Failed to check hotfix status:', error);
    return false;
  }
}
