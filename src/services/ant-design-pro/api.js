// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function removeRule(
    params,
    options,
) {
    return request('/api/all/menus', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}


export async function rule(
    params,
    options,
) {
    return request('/api/all/menus', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}