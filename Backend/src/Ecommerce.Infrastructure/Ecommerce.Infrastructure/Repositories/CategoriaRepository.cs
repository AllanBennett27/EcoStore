using Ecommerce.Application.DTOs;
using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Entities;
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
            .Select(p => new CategoriaDto
            {
                IdCategoria     = p.IdCategoria,
                NombreCategoria = p.NombreCategoria,
                Descripcion     = p.Descripcion ?? string.Empty,
                Estado          = p.Estado,
            })
            .ToListAsync();
    }

    public async Task<CategoriaDto> CreateAsync(CreateCategoriaDto dto)
    {
        var categoria = new Categoria
        {
            NombreCategoria = dto.NombreCategoria,
            Descripcion     = dto.Descripcion,
            Estado          = "Activo",
        };

        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();

        return new CategoriaDto
        {
            IdCategoria     = categoria.IdCategoria,
            NombreCategoria = categoria.NombreCategoria,
            Descripcion     = categoria.Descripcion,
            Estado          = categoria.Estado,
        };
    }
}