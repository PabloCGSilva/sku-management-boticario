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
    CircularProgress,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material'
import {
    Add,
    Edit,
    Delete,
    Lock,
    Visibility,
    ArrowForward,
    Info
} from '@mui/icons-material'
import { useSKUs, useDeleteSKU, useUpdateSKU } from '../hooks/useSKUs'
import { SKU, SKUStatus } from '../types'

const statusColors = {
    [SKUStatus.PRE_CADASTRO]: 'warning',
    [SKUStatus.CADASTRO_COMPLETO]: 'info',
    [SKUStatus.ATIVO]: 'success',
    [SKUStatus.DESATIVADO]: 'default',
    [SKUStatus.CANCELADO]: 'error',
} as const

const statusLabels = {
    [SKUStatus.PRE_CADASTRO]: 'Pré-Cadastro',
    [SKUStatus.CADASTRO_COMPLETO]: 'Cadastro Completo',
    [SKUStatus.ATIVO]: 'Ativo',
    [SKUStatus.DESATIVADO]: 'Desativado',
    [SKUStatus.CANCELADO]: 'Cancelado',
}

const statusTransitions = {
    [SKUStatus.PRE_CADASTRO]: [SKUStatus.CADASTRO_COMPLETO, SKUStatus.CANCELADO],
    [SKUStatus.CADASTRO_COMPLETO]: [SKUStatus.PRE_CADASTRO, SKUStatus.ATIVO, SKUStatus.CANCELADO],
    [SKUStatus.ATIVO]: [SKUStatus.DESATIVADO],
    [SKUStatus.DESATIVADO]: [SKUStatus.ATIVO, SKUStatus.PRE_CADASTRO],
    [SKUStatus.CANCELADO]: [],
}

// Business rules for what actions are allowed per status
const getActionPermissions = (status: SKUStatus) => {
    switch (status) {
        case SKUStatus.PRE_CADASTRO:
            return {
                canEdit: true,
                canDelete: true,
                canChangeStatus: true,
                editableFields: ['description', 'commercialDescription', 'sku'],
                description: 'Permite editar todos os campos'
            }
        case SKUStatus.CADASTRO_COMPLETO:
            return {
                canEdit: true,
                canDelete: true,
                canChangeStatus: true,
                editableFields: ['commercialDescription'],
                description: 'Permite editar apenas descrição comercial'
            }
        case SKUStatus.ATIVO:
            return {
                canEdit: false,
                canDelete: false,
                canChangeStatus: true,
                editableFields: [],
                description: 'Nenhuma edição permitida, apenas mudança de status'
            }
        case SKUStatus.DESATIVADO:
            return {
                canEdit: false,
                canDelete: false,
                canChangeStatus: true,
                editableFields: [],
                description: 'Nenhuma edição permitida, apenas mudança de status'
            }
        case SKUStatus.CANCELADO:
            return {
                canEdit: false,
                canDelete: false,
                canChangeStatus: false,
                editableFields: [],
                description: 'Status final - nenhuma alteração permitida'
            }
        default:
            return {
                canEdit: false,
                canDelete: false,
                canChangeStatus: false,
                editableFields: [],
                description: 'Status desconhecido'
            }
    }
}

const SKUList: React.FC = () => {
    const navigate = useNavigate()
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [statusDialogOpen, setStatusDialogOpen] = useState(false)
    const [selectedSKU, setSelectedSKU] = useState<SKU | null>(null)
    const [newStatus, setNewStatus] = useState<SKUStatus | ''>('')

    const { data: skus, isLoading, error } = useSKUs()
    const deleteSKU = useDeleteSKU()
    const updateSKU = useUpdateSKU()

    const filteredSKUs = skus?.filter(sku =>
        statusFilter === 'all' || sku.status === statusFilter
    ) || []

    const handleStatusChangeClick = (sku: SKU, targetStatus: SKUStatus) => {
        setSelectedSKU(sku)
        setNewStatus(targetStatus)
        setStatusDialogOpen(true)
    }

    const confirmStatusChange = () => {
        if (selectedSKU && newStatus) {
            updateSKU.mutate({
                id: selectedSKU.id,
                data: { status: newStatus }
            })
        }
        setStatusDialogOpen(false)
        setSelectedSKU(null)
        setNewStatus('')
    }

    const handleDelete = (sku: SKU) => {
        const permissions = getActionPermissions(sku.status)

        if (!permissions.canDelete) {
            alert(`Não é possível excluir SKU no status ${statusLabels[sku.status]}`)
            return
        }

        if (window.confirm(`Tem certeza que deseja excluir o SKU "${sku.sku}"?`)) {
            deleteSKU.mutate(sku.id)
        }
    }

    const handleEdit = (sku: SKU) => {
        const permissions = getActionPermissions(sku.status)

        if (!permissions.canEdit && !permissions.canChangeStatus) {
            alert(`SKU no status ${statusLabels[sku.status]} não permite alterações`)
            return
        }

        navigate(`/edit/${sku.id}`)
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

            {/* Filter Controls */}
            <Box mb={3} display="flex" gap={2} alignItems="center">
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filtrar por Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Filtrar por Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="all">Todos ({skus?.length || 0})</MenuItem>
                        {Object.values(SKUStatus).map(status => {
                            const count = skus?.filter(sku => sku.status === status).length || 0
                            return (
                                <MenuItem key={status} value={status}>
                                    {statusLabels[status]} ({count})
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>

                <Alert severity="info" sx={{ flex: 1 }}>
                    <strong>Legenda:</strong>
                    <Edit sx={{ mx: 1, fontSize: 16 }} /> Editar |
                    <Visibility sx={{ mx: 1, fontSize: 16 }} /> Visualizar |
                    <Lock sx={{ mx: 1, fontSize: 16 }} /> Bloqueado |
                    <ArrowForward sx={{ mx: 1, fontSize: 16 }} /> Transição de Status
                </Alert>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>SKU</strong></TableCell>
                            <TableCell><strong>Descrição</strong></TableCell>
                            <TableCell><strong>Descrição Comercial</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Ações Permitidas</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSKUs.map((sku) => {
                            const permissions = getActionPermissions(sku.status)
                            const transitions = statusTransitions[sku.status]

                            return (
                                <TableRow key={sku.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                            {sku.sku}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{sku.description}</TableCell>
                                    <TableCell>{sku.commercialDescription}</TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Chip
                                                label={statusLabels[sku.status]}
                                                color={statusColors[sku.status]}
                                                size="small"
                                            />
                                            <Tooltip title={permissions.description}>
                                                <Info color="action" fontSize="small" />
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={1} flexWrap="wrap">
                                            {/* Edit/View Button */}
                                            {permissions.canEdit ? (
                                                <Tooltip title="Editar SKU">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEdit(sku)}
                                                        color="primary"
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : permissions.canChangeStatus ? (
                                                <Tooltip title="Visualizar/Alterar Status">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEdit(sku)}
                                                        color="default"
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="SKU bloqueado para alterações">
                                                    <IconButton size="small" disabled>
                                                        <Lock />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            {/* Delete Button */}
                                            {permissions.canDelete ? (
                                                <Tooltip title="Excluir SKU">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(sku)}
                                                        color="error"
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Exclusão não permitida neste status">
                                                    <IconButton size="small" disabled>
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            {/* Status Transition Buttons */}
                                            {transitions.map(nextStatus => (
                                                <Tooltip
                                                    key={nextStatus}
                                                    title={`Alterar para ${statusLabels[nextStatus]}`}
                                                >
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => handleStatusChangeClick(sku, nextStatus)}
                                                        startIcon={<ArrowForward />}
                                                        sx={{ minWidth: 'auto' }}
                                                    >
                                                        {statusLabels[nextStatus]}
                                                    </Button>
                                                </Tooltip>
                                            ))}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )
                        })}

                        {filteredSKUs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography color="text.secondary" sx={{ py: 3 }}>
                                        {statusFilter === 'all'
                                            ? 'Nenhum SKU cadastrado'
                                            : `Nenhum SKU encontrado com status ${statusLabels[statusFilter as SKUStatus]}`
                                        }
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Status Change Confirmation Dialog */}
            <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
                <DialogTitle>Confirmar Alteração de Status</DialogTitle>
                <DialogContent>
                    <Typography>
                        Deseja alterar o status do SKU "{selectedSKU?.sku}" de{' '}
                        <strong>{selectedSKU && statusLabels[selectedSKU.status]}</strong> para{' '}
                        <strong>{newStatus && statusLabels[newStatus]}</strong>?
                    </Typography>

                    {selectedSKU?.status === SKUStatus.CADASTRO_COMPLETO &&
                        newStatus === SKUStatus.PRE_CADASTRO && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Esta transição pode ter sido causada pela alteração da descrição comercial.
                            </Alert>
                        )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={confirmStatusChange} variant="contained">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default SKUList