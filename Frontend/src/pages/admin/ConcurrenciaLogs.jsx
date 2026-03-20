import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import {
  Box, Typography, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  CircularProgress, Alert, IconButton, Tooltip,
} from '@mui/material';
import { Warning, Refresh, FiberManualRecord } from '@mui/icons-material';
import Header from '../../components/Header';
import { checkoutService } from '../../services/api';

function ConcurrenciaLogs() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [live, setLive]       = useState(false);
  const connectionRef         = useRef(null);

  const cargarLogs = () => {
    setLoading(true);
    checkoutService.getConcurrenciaLogs()
      .then((res) => { setLogs(res.data ?? []); setError(null); })
      .catch(() => setError('No se pudieron cargar los logs.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarLogs();
  }, []);

  // SignalR — actualiza la lista en tiempo real cuando ocurre un rollback
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/cartHub', { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    connection.on('ConcurrenciaRollback', (entry) => {
      setLogs((prev) => [entry, ...prev]);
    });

    connection.start()
      .then(() => setLive(true))
      .catch(() => setLive(false));

    connectionRef.current = connection;
    return () => { connection.stop(); setLive(false); };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Warning color="error" />
            <Typography variant="h5" fontWeight={700} color="error.dark">
              Logs de Concurrencia — ROLLBACK
            </Typography>
            {live && (
              <Chip
                icon={<FiberManualRecord sx={{ fontSize: '10px !important', color: 'success.main' }} />}
                label="En vivo"
                size="small"
                color="success"
                variant="outlined"
              />
            )}
          </Box>
          <Tooltip title="Recargar">
            <IconButton onClick={cargarLogs} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Registra cada transacción que fue revertida por conflicto de concurrencia
          (Isolation Level: <strong>SERIALIZABLE</strong> · UPDLOCK / HOLDLOCK).
          Los logs se acumulan mientras el servidor esté activo.
        </Typography>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>}
        {error   && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {!loading && !error && (
          <Card elevation={2}>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'error.50' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Usuario</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Mensaje del SP</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log, i) => (
                    <TableRow key={i} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(log.fecha).toLocaleString('es-HN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {log.nombreUsuario ?? `#${log.idUsuario}`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label="ROLLBACK" size="small" color="error" variant="filled" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="error.dark" fontFamily="monospace">
                          {log.mensaje}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {logs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary">
                          No se han registrado conflictos de concurrencia en esta sesión.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default ConcurrenciaLogs;
