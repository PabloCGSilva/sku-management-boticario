import React, { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Box,
    Button,
    Typography,
    Paper,
    TextField,
    Alert,
    CircularProgress,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material'
import { ArrowBack, Lock, Edit } from '@mui/icons-material'
import { useSKU, useCreateSKU, useUpdateSKU } from '../hooks/useSKUs'
import { createSKUSchema, CreateSKUFormData } from '../utils/validation'

const getFieldPermissions = (status?: string) => {
    switch (status) {
        case 'PRE_CADASTRO':
            return {
                description: true,
                commercialDescription: true,
                sku: true,
                canChangeStatus: true,
                allowedStatuses: ['CADASTRO_COMPLETO', 'CANCELADO']
            }
        case 'CADASTRO_COMPLETO':
            return {
                description: false,
                commercialDescription: true,
                sku: false,
                canChangeStatus: true,
                allowedStatuses: ['ATIVO', 'CANCELADO']
            }
        case 'ATIVO':
            return {
                description: false,
                commercialDescription: false,
                sku: false,
                canChangeStatus: true,
                allowedStatuses: ['DESATIVADO']
            }
        case 'DESATIVADO':
            return {
                description: false,
                commercialDescription: false,
                sku: false,
                canChangeStatus: true,
                allowedStatuses: ['ATIVO', 'PRE_CADASTRO']
            }
        case 'CANCELADO':
            return {
                description: false,
                commercialDescription: false,
                sku: false,
                canChangeStatus: false,
                allowedStatuses: []
            }
        default:
            return {
                description: true,
                commercialDescription: true,
                sku: true,
                canChangeStatus: false,
                allowedStatuses: []
            }
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'PRE_CADASTRO': return 'warning'
        case 'CADASTRO_COMPLETO': return 'info'
        case 'ATIVO': return 'success'
        case 'DESATIVADO': return 'default'
        case 'CANCELADO': return 'error'
        default: return 'default'
    }
}

const SKUForm: React.FC = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const isEditing = Boolean(id)

    const { data: sku, isLoading: isLoadingSKU } = useSKU(id || '')
    const createSKU = useCreateSKU()
    const updateSKU = useUpdateSKU()

    const permissions = useMemo(() =>
        getFieldPermissions(sku?.status),
        [sku?.status]
    )

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<CreateSKUFormData & { status?: string }>({
        resolver: zodResolver(createSKUSchema),
        defaultValues: {
            description: '',
            commercialDescription: '',
            sku: '',
        }
    })

    const watchedCommercialDescription = watch('commercialDescription')

    useEffect(() => {
        if (sku && isEditing) {
            reset({
                description: sku.description,
                commercialDescription: sku.commercialDescription,
                sku: sku.sku,
                status: sku.status
            })
        }
    }, [sku, reset, isEditing])

    const onSubmit = async (data: CreateSKUFormData & { status?: string }) => {
        try {
            if (isEditing && id) {
                const updateData: any = {}

                if (permissions.description) updateData.description = data.description
                if (permissions.commercialDescription) updateData.commercialDescription = data.commercialDescription
                if (permissions.sku) updateData.sku = data.sku
                if (permissions.canChangeStatus && data.status) updateData.status = data.status

                await updateSKU.mutateAsync({ id, data: updateData })
            } else {
                await createSKU.mutateAsync(data)
            }
            navigate('/')
        } catch (error) {
            console.error('Erro ao salvar SKU:', error)
        }
    }

    if (isLoadingSKU && isEditing) return <CircularProgress />

    const commercialDescriptionChanged = isEditing &&
        sku?.status === 'CADASTRO_COMPLETO' &&
        watchedCommercialDescription !== sku?.commercialDescription

    return (
        <Box>
            <Box display="flex" alignItems="center" mb={3}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/')}
                    sx={{ mr: 2 }}
                >
                    Voltar
                </Button>
                <Typography variant="h4" component="h1">
                    {isEditing ? 'Editar SKU' : 'Novo SKU'}
                </Typography>
                {sku?.status && (
                    <Chip
                        label={sku.status.replace('_', ' ')}
                        color={getStatusColor(sku.status) as any}
                        sx={{ ml: 2 }}
                    />
                )}
            </Box>

            {/* Business Rule Warning */}
            {commercialDescriptionChanged && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    ⚠️ <strong>Regra de Negócio:</strong> Alterar a descrição comercial em CADASTRO_COMPLETO
                    retornará o SKU para status PRE_CADASTRO automaticamente.
                </Alert>
            )}

            {/* Field Restrictions Info */}
            {isEditing && sku?.status && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    <strong>Status atual:</strong> {sku.status.replace('_', ' ')} -
                    {permissions.description || permissions.commercialDescription || permissions.sku
                        ? ` Campos editáveis: ${[
                            permissions.description && 'Descrição',
                            permissions.commercialDescription && 'Descrição Comercial',
                            permissions.sku && 'SKU'
                        ].filter(Boolean).join(', ')}`
                        : ' Nenhum campo editável neste status'
                    }
                </Alert>
            )}

            <Paper sx={{ p: 3 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box display="flex" flexDirection="column" gap={3}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Descrição"
                                    fullWidth
                                    disabled={isEditing && !permissions.description}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                    InputProps={{
                                        endAdornment: isEditing && !permissions.description ? <Lock color="disabled" /> : <Edit color="action" />
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="commercialDescription"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Descrição Comercial"
                                    fullWidth
                                    disabled={isEditing && !permissions.commercialDescription}
                                    error={!!errors.commercialDescription}
                                    helperText={errors.commercialDescription?.message}
                                    InputProps={{
                                        endAdornment: isEditing && !permissions.commercialDescription ? <Lock color="disabled" /> : <Edit color="action" />
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="sku"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="SKU"
                                    fullWidth
                                    disabled={isEditing && !permissions.sku}
                                    error={!!errors.sku}
                                    helperText={errors.sku?.message}
                                    InputProps={{
                                        endAdornment: isEditing && !permissions.sku ? <Lock color="disabled" /> : <Edit color="action" />
                                    }}
                                />
                            )}
                        />

                        {/* Status Change (only for editing) */}
                        {isEditing && permissions.canChangeStatus && permissions.allowedStatuses.length > 0 && (
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Alterar Status</InputLabel>
                                        <Select
                                            {...field}
                                            label="Alterar Status"
                                            value={field.value || ''}
                                        >
                                            <MenuItem value="">Manter status atual</MenuItem>
                                            {permissions.allowedStatuses.map(status => (
                                                <MenuItem key={status} value={status}>
                                                    {status.replace('_', ' ')}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        )}

                        {(createSKU.isError || updateSKU.isError) && (
                            <Alert severity="error">
                                Erro ao salvar SKU. Tente novamente.
                            </Alert>
                        )}

                        <Box display="flex" gap={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting || (isEditing && sku?.status === 'CANCELADO')}
                            >
                                {isSubmitting ? 'Salvando...' : 'Salvar'}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/')}
                            >
                                Cancelar
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Paper>
        </Box>
    )
}

export default SKUForm