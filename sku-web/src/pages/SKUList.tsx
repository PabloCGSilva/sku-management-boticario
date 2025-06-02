import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Button,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { useSKUs, useDeleteSKU, useUpdateSKU } from '../hooks/useSKUs'
import { SKU, SKUStatus } from '../types'

const statusColors = {
    [SKUStatus.PRE_CADASTRO]: 'warning',
    [SKUStatus.CADASTRO_COMPLETO]: 'info',
    [SKUStatus.ATIVO]: 'success',
    [SKUStatus.DESATIVADO]: 'default',
    [SKUStatus.CANCELADO]: 'error',
} as const

const statusTransitions = {
    [SKUStatus.PRE_CADASTRO]: [SKUStatus.CADASTRO_COMPLETO, SKUStatus.CANCELADO],
    [SKUStatus.CADASTRO_COMPLETO]: [SKUStatus.PRE_CADASTRO, SKUStatus.ATIVO, SKUStatus.CANCELADO],
    [SKUStatus.ATIVO]: [SKUStatus.DESATIVADO],
    [SKUStatus.DESATIVADO]: [SKUStatus.ATIVO, SKUStatus.PRE_CADASTRO],
    [SKUStatus.CANCELADO]: [],
}

const SKUList: React.FC = () => {
    const navigate = useNavigate()
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const { data: skus, isLoading, error } = useSKUs()
    const deleteSKU = useDeleteSKU()
    const updateSKU = useUpdateSKU()

    const filteredSKUs = skus?.filter(sku =>
        statusFilter === 'all' || sku.status === statusFilter
    ) || []

    const handleStatusChange = (sku: SKU, newStatus: SKUStatus) => {
        updateSKU.mutate({ id: sku.id, data: { status: newStatus } })
    }

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este SKU?')) {
            deleteSKU.mutate(id)
        }
    }

    if (isLoading) return <CircularProgress />
    if (error) return <Alert severity="error">Erro ao carregar SKUs</Alert>

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Gestão de SKUs
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/create')}
                >
                    Novo SKU
                </Button>
            </Box>

            <Box mb={3}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filtrar por Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Filtrar por Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="all">Todos</MenuItem>
                        {Object.values(SKUStatus).map(status => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>SKU</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Descrição Comercial</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSKUs.map((sku) => (
                            <TableRow key={sku.id}>
                                <TableCell>{sku.sku}</TableCell>
                                <TableCell>{sku.description}</TableCell>
                                <TableCell>{sku.commercialDescription}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={sku.status}
                                        color={statusColors[sku.status]}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" gap={1}>
                                        {(sku.status === SKUStatus.PRE_CADASTRO || sku.status === SKUStatus.CADASTRO_COMPLETO) && (
                                            <IconButton
                                                size="small"
                                                onClick={() => navigate(`/edit/${sku.id}`)}
                                            >
                                                <Edit />
                                            </IconButton>
                                        )}

                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(sku.id)}
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>

                                        {statusTransitions[sku.status].map(nextStatus => (
                                            <Button
                                                key={nextStatus}
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleStatusChange(sku, nextStatus)}
                                            >
                                                → {nextStatus}
                                            </Button>
                                        ))}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default SKUList