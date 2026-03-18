
using Ecommerce.Domain.DTOs;

namespace Ecommerce.Domain.Interfaces;

public interface IProductoRepository
{
    Task<IEnumerable<ProductoDto>> GetAllAsync();
    Task<IEnumerable<ProductoDto>> GetActiveAsync();
    Task<ProductoDto?> GetByIdAsync(int id);
    Task<ProductoDto> CreateAsync(CreateProductoDto createDto);
    Task<bool> UpdateAsync(int id, UpdateProductoDto updateDto);
    Task<bool> ChangeStatusAsync(int id, string estado);
}
