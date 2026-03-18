using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Interfaces;
using Ecommerce.Domain.DTOs;
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

    public async Task<IEnumerable<UsuarioDto>> GetAllUsersAsync()
    {
        return await _context.Usuarios
            .Include(u => u.Rol)
            .Select(u => new UsuarioDto
            {
                IdUsuario = u.IdUsuario,
                Nombre = u.Nombre,
                Apellido = u.Apellido,
                Correo = u.Correo,
                Telefono = u.Telefono,
                Direccion = u.Direccion,
                FechaRegistro = u.FechaRegistro,
                Estado = u.Estado,
                IdRol = u.IdRol,
                NombreRol = u.Rol.NombreRol
            })
            .ToListAsync();
    }

    public async Task<Usuario?> GetByIdAsync(int id)
    {
        return await _context.Usuarios
            .Include(u => u.Rol)
            .FirstOrDefaultAsync(u => u.IdUsuario == id);
    }

    public async Task<bool> UpdateUserRoleAsync(int userId, int roleId)
    {
        var usuario = await GetByIdAsync(userId);
        if (usuario == null) return false;

        usuario.IdRol = roleId;
        return await _context.SaveChangesAsync() > 0;
    }
}