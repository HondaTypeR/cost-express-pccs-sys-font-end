// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function getAllMenu(
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
