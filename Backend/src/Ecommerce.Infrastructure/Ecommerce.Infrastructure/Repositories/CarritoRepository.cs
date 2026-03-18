using Ecommerce.Domain.Interfaces;
using Ecommerce.Infrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories;

public class CarritoRepository : ICarritoRepository
{
    private readonly ApplicationDbContext _context;

    public CarritoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AgregarProductoAsync(int usuarioId, int productoId, int cantidad, decimal precio)
    {
        var parameters = new[]
        {
            new SqlParameter("@IdUsuario", usuarioId),
            new SqlParameter("@IdProducto", productoId),
            new SqlParameter("@Cantidad", cantidad),
            new SqlParameter("@PrecioUnitario", precio)
        };

        await _context.Database.ExecuteSqlRawAsync(
            "EXEC dbo.sp_AgregarProductoAlCarrito @IdUsuario, @IdProducto, @Cantidad, @PrecioUnitario",
            parameters
        );
    }

    public async Task EliminarProductoAsync(int usuarioId, int productoId)
    {
        var parameters = new[]
        {
            new SqlParameter("@IdUsuario", usuarioId),
            new SqlParameter("@IdProducto", productoId)
        };

        await _context.Database.ExecuteSqlRawAsync(
            "EXEC dbo.sp_EliminarProductoDelCarrito @IdUsuario, @IdProducto",
            parameters
        );
    }
}