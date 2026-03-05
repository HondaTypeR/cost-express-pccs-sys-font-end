// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';


/** 获取当前的用户 GET /api/currentUser */
export async function fetchUser(options) {
    return request('/api/user/list', {
        method: 'GET',
        ...(options || {}),
    });
}

export async function addUser(body, options) {
    return request('/api/user/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

export async function updateUser(body, options) {
    return request('/api/user/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}