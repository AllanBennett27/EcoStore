using Ecommerce.Application.DTOs;
using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Interfaces;
using Ecommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories;

public class CategoriaRepository : ICategoriaRepository
{
    private readonly ApplicationDbContext _context;

    public CategoriaRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CategoriaDto>> GetAllAsync()
    {
        return await _context.Categorias
            .Select(p => new CategoriaDto()
            {
                IdCategoria = p.IdCategoria,
                NombreCategoria = p.NombreCategoria,
                Descripcion = p.Descripcion ?? string.Empty,
                Estado = p.Estado,
            })
            .ToListAsync();
    }
}