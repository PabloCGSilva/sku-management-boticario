import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { skuApi } from '../services/api'
import { UpdateSKUData } from '../types'

export const useSKUs = () => {
    return useQuery({
        queryKey: ['skus'],
        queryFn: skuApi.getAll,
    })
}

export const useSKU = (id: string) => {
    return useQuery({
        queryKey: ['sku', id],
        queryFn: () => skuApi.getById(id),
        enabled: !!id,
    })
}

export const useCreateSKU = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: skuApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['skus'] })
        },
    })
}

export const useUpdateSKU = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateSKUData }) =>
            skuApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['skus'] })
            queryClient.invalidateQueries({ queryKey: ['sku', id] })
        },
    })
}

export const useDeleteSKU = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: skuApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['skus'] })
        },
    })
}