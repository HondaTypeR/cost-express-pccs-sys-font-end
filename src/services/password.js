// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 修改密码 POST /api/user/change-password */
export async function changePassword(body, options) {
    return request('/api/user/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
