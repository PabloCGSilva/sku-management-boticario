import React, { useEffect } from 'react'
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
    CircularProgress
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useSKU, useCreateSKU, useUpdateSKU } from '../hooks/useSKUs'
import { createSKUSchema, CreateSKUFormData } from '../utils/validation'

const SKUForm: React.FC = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const isEditing = Boolean(id)

    const { data: sku, isLoading: isLoadingSKU } = useSKU(id || '')
    const createSKU = useCreateSKU()
    const updateSKU = useUpdateSKU()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<CreateSKUFormData>({
        resolver: zodResolver(createSKUSchema),
        defaultValues: {
            description: '',
            commercialDescription: '',
            sku: '',
        }
    })

    useEffect(() => {
        if (sku && isEditing) {
            reset({
                description: sku.description,
                commercialDescription: sku.commercialDescription,
                sku: sku.sku,
            })
        }
    }, [sku, reset, isEditing])

    const onSubmit = async (data: CreateSKUFormData) => {
        try {
            if (isEditing && id) {
                await updateSKU.mutateAsync({ id, data })
            } else {
                await createSKU.mutateAsync(data)
            }
            navigate('/')
        } catch (error) {
            console.error('Erro ao salvar SKU:', error)
        }
    }

    if (isLoadingSKU && isEditing) return <CircularProgress />

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
            </Box>

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
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
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
                                    error={!!errors.commercialDescription}
                                    helperText={errors.commercialDescription?.message}
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
                                    error={!!errors.sku}
                                    helperText={errors.sku?.message}
                                />
                            )}
                        />

                        {(createSKU.isError || updateSKU.isError) && (
                            <Alert severity="error">
                                Erro ao salvar SKU. Tente novamente.
                            </Alert>
                        )}

                        <Box display="flex" gap={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
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