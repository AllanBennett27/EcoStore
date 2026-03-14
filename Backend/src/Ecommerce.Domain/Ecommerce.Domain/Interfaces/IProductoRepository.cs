using Ecommerce.Application.DTOs;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Domain.Interfaces;

public interface IProductoRepository
{
    Task<IEnumerable<ProductoDto>> GetAllAsync();
}