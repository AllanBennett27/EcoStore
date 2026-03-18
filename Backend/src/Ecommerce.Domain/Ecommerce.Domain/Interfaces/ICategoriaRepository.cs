using Ecommerce.Application.DTOs;
using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Domain.Interfaces;

public interface ICategoriaRepository
{
    Task<IEnumerable<CategoriaDto>> GetAllAsync();
}