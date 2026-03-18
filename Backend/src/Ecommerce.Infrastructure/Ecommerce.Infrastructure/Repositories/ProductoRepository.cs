using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Entities;
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
            .Include(p => p.Categoria)
            .Select(MapToDto())
            .ToListAsync();
    }

    public async Task<IEnumerable<ProductoDto>> GetActiveAsync()
    {
        return await _context.Productos
            .Include(p => p.Categoria)
            .Where(p => p.Estado == "Activo")
            .Select(MapToDto())
            .ToListAsync();
    }

    public async Task<ProductoDto?> GetByIdAsync(int id)
    {
        return await _context.Productos
            .Include(p => p.Categoria)
            .Where(p => p.IdProducto == id)
            .Select(MapToDto())
            .FirstOrDefaultAsync();
    }

    public async Task<ProductoDto> CreateAsync(CreateProductoDto createDto)
    {
        var producto = new Producto
        {
            NombreProducto = createDto.Nombre,
            Descripcion = createDto.Descripcion,
            Precio = createDto.Precio,
            ImagenUrl = createDto.ImagenUrl,
            IdCategoria = createDto.IdCategoria,
            Estado = "Activo"
        };

        _context.Productos.Add(producto);
        await _context.SaveChangesAsync();

        return (await GetByIdAsync(producto.IdProducto))!;
    }

    public async Task<bool> UpdateAsync(int id, UpdateProductoDto updateDto)
    {
        var producto = await _context.Productos.FindAsync(id);

        if (producto is null)
        {
            return false;
        }

        producto.NombreProducto = updateDto.Nombre ?? producto.NombreProducto;
        producto.Descripcion = updateDto.Descripcion ?? producto.Descripcion;
        producto.Precio = updateDto.Precio ?? producto.Precio;
        producto.ImagenUrl = updateDto.ImagenUrl ?? producto.ImagenUrl;
        producto.IdCategoria = updateDto.IdCategoria ?? producto.IdCategoria;
        producto.Estado = updateDto.Estado ?? producto.Estado;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ChangeStatusAsync(int id, string estado)
    {
        var producto = await _context.Productos.FindAsync(id);

        if (producto is null)
        {
            return false;
        }

        producto.Estado = estado;
        await _context.SaveChangesAsync();
        return true;
    }

    private static System.Linq.Expressions.Expression<Func<Producto, ProductoDto>> MapToDto()
    {
        return p => new ProductoDto
        {
            IdProducto = p.IdProducto,
            Nombre = p.NombreProducto,
            Descripcion = p.Descripcion,
            Precio = p.Precio,
            ImagenUrl = p.ImagenUrl,
            Estado = p.Estado,
            IdCategoria = p.IdCategoria,
            NombreCategoria = p.Categoria.NombreCategoria
        };
    }
}
