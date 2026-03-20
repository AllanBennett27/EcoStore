using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Interfaces;
using Ecommerce.Infrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories;

public class CheckoutRepository : ICheckoutRepository
{
    private readonly ApplicationDbContext _context;

    public CheckoutRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ConfirmarCompraResultDto> ConfirmarCompraAsync(int idUsuario, int idDireccion, int idMetodo)
    {
        var conn = _context.Database.GetDbConnection();
        if (conn.State != System.Data.ConnectionState.Open)
            await conn.OpenAsync();

        // Obtener carrito activo del usuario
        int carritoId;
        using (var cmd = conn.CreateCommand())
        {
            cmd.CommandText = "SELECT TOP 1 id_carrito FROM Carrito WHERE id_usuario = @uid AND estado = 1";
            cmd.Parameters.Add(new SqlParameter("@uid", idUsuario));
            var result = await cmd.ExecuteScalarAsync();

            if (result == null || result == DBNull.Value)
                throw new InvalidOperationException("No tienes productos en el carrito.");

            carritoId = (int)result;
        }

        // Pausa de demostración de concurrencia (6 s)
        await Task.Delay(6000);

        // Confirmar compra mediante SP
        int idPedido;
        decimal totalFinal;
        using (var cmd = conn.CreateCommand())
        {
            cmd.CommandText = "EXEC sp_ConfirmarCompra @id_usuario, @id_carrito, @id_direccion, @id_metodo";
            cmd.Parameters.Add(new SqlParameter("@id_usuario",   idUsuario));
            cmd.Parameters.Add(new SqlParameter("@id_carrito",   carritoId));
            cmd.Parameters.Add(new SqlParameter("@id_direccion", idDireccion));
            cmd.Parameters.Add(new SqlParameter("@id_metodo",    idMetodo));

            using var reader = await cmd.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
                throw new InvalidOperationException("Error al procesar el pedido.");

            idPedido   = reader.GetInt32(reader.GetOrdinal("id_pedido"));
            totalFinal = reader.GetDecimal(reader.GetOrdinal("total_final"));
        }

        // Obtener stocks actualizados de los productos del pedido
        var stocks = await _context.DetallePedidos
            .Where(dp => dp.IdPedido == idPedido)
            .Join(_context.Inventarios,
                dp  => dp.IdProducto,
                inv => inv.IdProducto,
                (dp, inv) => new StockActualizadoDto(dp.IdProducto, inv.StockActual))
            .ToListAsync();

        return new ConfirmarCompraResultDto(idPedido, totalFinal, stocks);
    }
}
