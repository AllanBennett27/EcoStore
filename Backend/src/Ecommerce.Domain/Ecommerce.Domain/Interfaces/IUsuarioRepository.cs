using Ecommerce.Domain.Entities;

namespace Ecommerce.Domain.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByEmailAsync(string email);
    Task<bool> RegistrarAsync(Usuario usuario, string password);
    
    //Login
    Task<Usuario?> ValidarLoginAsync(string email, string password);
}