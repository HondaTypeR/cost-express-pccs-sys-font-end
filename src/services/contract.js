import { request } from '@umijs/max';

export async function listContract(body, options) {
    return request('/api/contract/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
export async function getContractRelated(contract_id, options) {
    return request(`/api/contract/${contract_id}/related`, {
        method: 'GET',
        ...(options || {}),
    });
}

export async function addContract(body, options) {
    return request('/api/contract/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

export async function updateContract(body, options) {
    return request('/api/contract/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

export async function deleteContract(body, options) {
    return request('/api/contract/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
