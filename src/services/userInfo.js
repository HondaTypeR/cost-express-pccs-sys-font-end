// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options) {
    return request('/api/auth/current-user', {
        method: 'GET',
        ...(options || {}),
    });
}