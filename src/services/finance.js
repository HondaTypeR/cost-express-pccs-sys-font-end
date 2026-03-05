import { request } from '@umijs/max';

export async function listFinancialData(params, options) {
    return request('/api/finance/list', {
        method: 'GET',
        params,
        ...(options || {}),
    });
}

export async function makePayment(body, options) {
    return request('/api/finance/payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

export async function getPaymentHistory(params, options) {
    return request('/api/finance/payment/history', {
        method: 'GET',
        params,
        ...(options || {}),
    });
}
