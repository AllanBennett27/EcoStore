using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Interfaces;
using Ecommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories;

public class MetodoPagoRepository : IMetodoPagoRepository
{
    private readonly ApplicationDbContext _context;

    public MetodoPagoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    private static MetodoPagoDto MapToDto(MetodoPago m) => new(
        m.IdMetodo,
        m.IdUsuario,
        m.Tipo,
        m.Proveedor,
        m.UltimosDigitos,
        m.EsPrincipal
    );

    public async Task<IEnumerable<MetodoPagoDto>> GetByUsuarioIdAsync(int usuarioId)
    {
        return await _context.MetodosPago
            .Where(m => m.IdUsuario == usuarioId)
            .Select(m => MapToDto(m))
            .ToListAsync();
    }

    public async Task<MetodoPagoDto?> GetByIdAsync(int idMetodo)
    {
        var metodo = await _context.MetodosPago.FindAsync(idMetodo);
        return metodo is null ? null : MapToDto(metodo);
    }

    public async Task<MetodoPagoDto> CreateAsync(int usuarioId, CreateMetodoPagoDto dto)
    {
        if (dto.EsPrincipal)
            await QuitarPrincipalAsync(usuarioId);

        var metodo = new MetodoPago
        {
            IdUsuario      = usuarioId,
            Tipo           = dto.Tipo,
            Proveedor      = dto.Proveedor,
            UltimosDigitos = dto.UltimosDigitos,
            EsPrincipal    = dto.EsPrincipal
        };

        _context.MetodosPago.Add(metodo);
        await _context.SaveChangesAsync();
        return MapToDto(metodo);
    }

    public async Task<bool> DeleteAsync(int idMetodo)
    {
        var metodo = await _context.MetodosPago.FindAsync(idMetodo);
        if (metodo is null) return false;

        _context.MetodosPago.Remove(metodo);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetPrincipalAsync(int idMetodo, int usuarioId)
    {
        var metodo = await _context.MetodosPago.FindAsync(idMetodo);
        if (metodo is null || metodo.IdUsuario != usuarioId) return false;

        await QuitarPrincipalAsync(usuarioId);
        metodo.EsPrincipal = true;
        await _context.SaveChangesAsync();
        return true;
    }

    private async Task QuitarPrincipalAsync(int usuarioId)
    {
        var principales = await _context.MetodosPago
            .Where(m => m.IdUsuario == usuarioId && m.EsPrincipal)
            .ToListAsync();
        principales.ForEach(m => m.EsPrincipal = false);
    }
}
