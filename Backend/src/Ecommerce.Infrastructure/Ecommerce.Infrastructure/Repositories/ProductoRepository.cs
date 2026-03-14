using Ecommerce.Application.DTOs;
using Ecommerce.Domain.Interfaces;
using Ecommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories;

public class ProductoRepository : IProductoRepository
{
    private readonly ApplicationDbContext _context;

    public ProductoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProductoDto>> GetAllAsync()
    {
        return await _context.Productos
            .Select(p => new ProductoDto
            {
                IdProducto = p.IdProducto,
                Nombre = p.NombreProducto,
                Descripcion = p.Descripcion,
                Precio = p.Precio,
                ImagenUrl = p.ImagenUrl,
                Estado = p.Estado,
                NombreCategoria = p.Categoria.NombreCategoria 
            })
            .ToListAsync();
    }
}