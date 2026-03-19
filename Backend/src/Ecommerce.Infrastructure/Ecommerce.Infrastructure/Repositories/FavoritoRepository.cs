using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Interfaces;
using Ecommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories;

public class FavoritoRepository : IFavoritoRepository
{
    private readonly ApplicationDbContext _context;

    public FavoritoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<FavoritoDto>> GetByUsuarioIdAsync(int usuarioId)
    {
        return await _context.Favoritos
            .Where(f => f.IdUsuario == usuarioId)
            .Include(f => f.Producto)
                .ThenInclude(p => p.Categoria)
            .Select(f => new FavoritoDto(
                f.IdFavorito,
                f.IdProducto,
                f.Producto.NombreProducto,
                f.Producto.Precio,
                f.Producto.ImagenUrl,
                f.Producto.Categoria.NombreCategoria,
                f.FechaAgregado
            ))
            .ToListAsync();
    }

    public async Task<FavoritoDto> AddAsync(int usuarioId, int idProducto)
    {
        var favorito = new Favorito
        {
            IdUsuario   = usuarioId,
            IdProducto  = idProducto,
            FechaAgregado = DateTime.Now
        };

        _context.Favoritos.Add(favorito);
        await _context.SaveChangesAsync();

        // Recargar con navegación para retornar DTO completo
        await _context.Entry(favorito).Reference(f => f.Producto).LoadAsync();
        await _context.Entry(favorito.Producto).Reference(p => p.Categoria).LoadAsync();

        return new FavoritoDto(
            favorito.IdFavorito,
            favorito.IdProducto,
            favorito.Producto.NombreProducto,
            favorito.Producto.Precio,
            favorito.Producto.ImagenUrl,
            favorito.Producto.Categoria.NombreCategoria,
            favorito.FechaAgregado
        );
    }

    public async Task<bool> RemoveAsync(int usuarioId, int idProducto)
    {
        var favorito = await _context.Favoritos
            .FirstOrDefaultAsync(f => f.IdUsuario == usuarioId && f.IdProducto == idProducto);

        if (favorito is null) return false;

        _context.Favoritos.Remove(favorito);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsFavoritoAsync(int usuarioId, int idProducto)
    {
        return await _context.Favoritos
            .AnyAsync(f => f.IdUsuario == usuarioId && f.IdProducto == idProducto);
    }
}
