import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material'
import SKUList from './pages/SKUList'
import SKUForm from './pages/SKUForm'

function App() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Sistema de Gestão de SKUs - Grupo Boticário
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Routes>
                    <Route path="/" element={<SKUList />} />
                    <Route path="/create" element={<SKUForm />} />
                    <Route path="/edit/:id" element={<SKUForm />} />
                </Routes>
            </Container>
        </Box>
    )
}

export default App