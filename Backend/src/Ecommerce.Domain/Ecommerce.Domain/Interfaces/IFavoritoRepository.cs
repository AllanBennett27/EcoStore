using Ecommerce.Domain.DTOs;

namespace Ecommerce.Domain.Interfaces;

public interface IFavoritoRepository
{
    Task<IEnumerable<FavoritoDto>> GetByUsuarioIdAsync(int usuarioId);
    Task<FavoritoDto> AddAsync(int usuarioId, int idProducto);
    Task<bool> RemoveAsync(int usuarioId, int idProducto);
    Task<bool> IsFavoritoAsync(int usuarioId, int idProducto);
}
