// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取用户菜单 GET /api/user/menus */
export async function getUserMenus(options) {
    return request('/api/auth/menu', {
        method: 'GET',
        ...(options || {}),
    });
}

