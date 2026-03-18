

using Ecommerce.Application.DTOs;
using Ecommerce.Domain.DTOs;

namespace Ecommerce.Domain.Interfaces;

public interface IProductoRepository
{
    Task<IEnumerable<ProductoDto>> GetAllAsync();
}