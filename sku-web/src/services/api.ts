import axios from 'axios'
import { SKU, CreateSKUData, UpdateSKUData } from '../types'

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

export const skuApi = {
    getAll: (): Promise<SKU[]> =>
        api.get('/skus').then(response => response.data),

    getById: (id: string): Promise<SKU> =>
        api.get(`/skus/${id}`).then(response => response.data),

    create: (data: CreateSKUData): Promise<SKU> =>
        api.post('/skus', data).then(response => response.data),

    update: (id: string, data: UpdateSKUData): Promise<SKU> =>
        api.put(`/skus/${id}`, data).then(response => response.data),

    delete: (id: string): Promise<void> =>
        api.delete(`/skus/${id}`).then(() => undefined),
}

export default api