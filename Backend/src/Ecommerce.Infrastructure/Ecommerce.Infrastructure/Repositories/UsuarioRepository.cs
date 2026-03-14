using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Interfaces;
using Ecommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using BC = BCrypt.Net.BCrypt;

namespace Ecommerce.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly ApplicationDbContext _context;

    public UsuarioRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Usuario?> GetByEmailAsync(string correo)
    {
        return await _context.Usuarios
            .Include(u => u.Rol)
            .FirstOrDefaultAsync(u => u.Correo == correo);
    }

    public async Task<bool> RegistrarAsync(Usuario usuario, string password)
    {
        usuario.Contrasenia = BC.HashPassword(password);
        
        _context.Usuarios.Add(usuario);
        return await _context.SaveChangesAsync() > 0;
    }
    
    public async Task<Usuario?> ValidarLoginAsync(string email, string password)
    {
        var usuario = await GetByEmailAsync(email);

        if (usuario == null) return null;

        bool isValid = BC.Verify(password, usuario.Contrasenia);

        return isValid ? usuario : null;
    }
}