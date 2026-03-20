using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Interfaces;
using Ecommerce.Infrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories;

public class VentasRepository : IVentasRepository
{
    private readonly ApplicationDbContext _context;

    public VentasRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ActualizarEstadoResultDto?> ActualizarEstadoAsync(int idPedido, string nuevoEstado)
    {
        var conn = _context.Database.GetDbConnection();
        if (conn.State != System.Data.ConnectionState.Open)
            await conn.OpenAsync();

        using var cmd = conn.CreateCommand();
        cmd.CommandText = "EXEC sp_ActualizarEstadoPedido @id_pedido, @nuevo_estado";
        cmd.Parameters.Add(new SqlParameter("@id_pedido",    idPedido));
        cmd.Parameters.Add(new SqlParameter("@nuevo_estado", nuevoEstado));

        using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync())
            return null;

        return new ActualizarEstadoResultDto(
            IdPedido:    reader["id_pedido"]   is int ip ? ip : Convert.ToInt32(reader["id_pedido"]),
            EstadoNuevo: reader["estado_nuevo"]?.ToString() ?? nuevoEstado,
            Resultado:   reader["resultado"]?.ToString()    ?? string.Empty
        );
    }
}
