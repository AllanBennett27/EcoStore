namespace Ecommerce.API.Services;

public record ConcurrenciaLogEntry(
    int      IdUsuario,
    string   NombreUsuario,
    int      IdCarrito,
    string   Mensaje,
    DateTime Fecha
);

/// <summary>
/// Singleton en memoria: registra cada rollback por conflicto de concurrencia.
/// Los datos persisten mientras el servidor esté corriendo.
/// </summary>
public class ConcurrenciaLogService
{
    private readonly List<ConcurrenciaLogEntry> _logs = [];

    public void Registrar(int idUsuario, string nombreUsuario, int idCarrito, string mensaje)
    {
        _logs.Insert(0, new ConcurrenciaLogEntry(idUsuario, nombreUsuario, idCarrito, mensaje, DateTime.Now));
    }

    public IReadOnlyList<ConcurrenciaLogEntry> ObtenerLogs() => _logs.AsReadOnly();
}
