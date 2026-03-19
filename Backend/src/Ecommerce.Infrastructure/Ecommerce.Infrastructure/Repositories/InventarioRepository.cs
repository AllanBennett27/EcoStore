using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Interfaces;
using Ecommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories;

public class InventarioRepository : IInventarioRepository
{
    private readonly ApplicationDbContext _context;

    public InventarioRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<InventarioDto>> GetAllAsync()
    {
        return await _context.Inventarios
            .Include(i => i.Producto)
                .ThenInclude(p => p.Categoria)
            .Select(i => new InventarioDto
            {
                IdInventario      = i.IdInventario,
                IdProducto        = i.IdProducto,
                NombreProducto    = i.Producto.NombreProducto,
                Categoria         = i.Producto.Categoria.NombreCategoria,
                StockActual       = i.StockActual,
                FechaActualizacion = i.FechaActualizacion,
                EstadoProducto    = i.Producto.Estado
            })
            .OrderBy(i => i.StockActual)
            .ToListAsync();
    }

    public async Task<InventarioDto?> GetByProductoIdAsync(int idProducto)
    {
        return await _context.Inventarios
            .Include(i => i.Producto)
                .ThenInclude(p => p.Categoria)
            .Where(i => i.IdProducto == idProducto)
            .Select(i => new InventarioDto
            {
                IdInventario      = i.IdInventario,
                IdProducto        = i.IdProducto,
                NombreProducto    = i.Producto.NombreProducto,
                Categoria         = i.Producto.Categoria.NombreCategoria,
                StockActual       = i.StockActual,
                FechaActualizacion = i.FechaActualizacion,
                EstadoProducto    = i.Producto.Estado
            })
            .FirstOrDefaultAsync();
    }
}
