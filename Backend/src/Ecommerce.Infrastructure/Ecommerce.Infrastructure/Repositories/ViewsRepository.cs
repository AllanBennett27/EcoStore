using Ecommerce.Domain.Entities.Views;
using Ecommerce.Domain.Interfaces;
using Ecommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories;

public class ViewsRepository : IViewsRepository
{
    private readonly ApplicationDbContext _context;

    public ViewsRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<VwVentasPorProducto>> GetVentasPorProductoAsync()
        => await _context.VwVentasPorProducto
            .OrderByDescending(v => v.TotalVendido)
            .ToListAsync();

    public async Task<IEnumerable<VwVentasPorUsuario>> GetVentasPorUsuarioAsync()
        => await _context.VwVentasPorUsuario
            .OrderByDescending(v => v.TotalGastado)
            .ToListAsync();

    public async Task<IEnumerable<VwStockBajo>> GetStockBajoAsync()
        => await _context.VwStockBajo
            .OrderBy(v => v.StockActual)
            .ToListAsync();

    public async Task<IEnumerable<VwDetallePedidos>> GetDetallePedidosAsync()
        => await _context.VwDetallePedidos
            .OrderByDescending(v => v.FechaPedido)
            .ToListAsync();

    public async Task<IEnumerable<VwDetallePedidos>> GetDetallePedidosByIdAsync(int idPedido)
        => await _context.VwDetallePedidos
            .Where(v => v.IdPedido == idPedido)
            .ToListAsync();

    public async Task<IEnumerable<VwFacturacion>> GetFacturacionAsync()
        => await _context.VwFacturacion
            .OrderByDescending(v => v.FechaFactura)
            .ToListAsync();

    public async Task<IEnumerable<VwCarritosActivos>> GetCarritosActivosAsync()
        => await _context.VwCarritosActivos
            .OrderByDescending(v => v.FechaCreacion)
            .ToListAsync();

    public async Task<IEnumerable<VwVentasPorFecha>> GetVentasPorFechaAsync()
        => await _context.VwVentasPorFecha
            .OrderByDescending(v => v.Fecha)
            .ToListAsync();
}
