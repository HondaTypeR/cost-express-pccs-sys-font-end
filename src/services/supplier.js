import { request } from '@umijs/max';

export async function supplierList(body, options) {
    return request('/api/supplier/list', {
        method: 'GET',
        ...(options || {}),
    });
}

export async function supplierAdd(body, options) {
    return request('/api/supplier/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

export async function supplierUpdate(body, options) {
    return request('/api/supplier/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

export async function supplierDelete(body, options) {
    return request('/api/supplier/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
