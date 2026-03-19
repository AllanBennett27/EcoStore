using Ecommerce.Domain.Entities;
using Ecommerce.Domain.DTOs;

namespace Ecommerce.Domain.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByEmailAsync(string email);
    Task<bool> RegistrarAsync(Usuario usuario, string password);

    //Login
    Task<Usuario?> ValidarLoginAsync(string email, string password);

    // User management
    Task<IEnumerable<UsuarioDto>> GetAllUsersAsync();
    Task<Usuario?> GetByIdAsync(int id);
    Task<bool> UpdateUserRoleAsync(int userId, int roleId);
    Task<bool> ToggleEstadoAsync(int userId);
}