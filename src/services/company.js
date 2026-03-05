// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 登录接口 POST /api/login/account */
export async function fetchCompany(body, options) {
    return request('/api/company/list', {
        method: 'GET',
        ...(options || {}),
    });
}

export async function addCompany(body, options) {
    return request('/api/company/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

export async function updateCompany(body, options) {
    return request('/api/company/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}