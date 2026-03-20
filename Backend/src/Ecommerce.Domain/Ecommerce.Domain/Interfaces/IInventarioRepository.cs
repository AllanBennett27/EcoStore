using Ecommerce.Domain.DTOs;

namespace Ecommerce.Domain.Interfaces;

public interface IInventarioRepository
{
    Task<IEnumerable<InventarioDto>> GetAllAsync();
    Task<InventarioDto?> GetByProductoIdAsync(int idProducto);
    Task<InventarioDto?> AjustarStockAsync(int idProducto, int cantidad);
}
