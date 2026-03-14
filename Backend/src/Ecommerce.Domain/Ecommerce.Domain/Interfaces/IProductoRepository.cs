

using Ecommerce.Application.DTOs;

namespace Ecommerce.Domain.Interfaces;

public interface IProductoRepository
{
    Task<IEnumerable<ProductoDto>> GetAllAsync();
}