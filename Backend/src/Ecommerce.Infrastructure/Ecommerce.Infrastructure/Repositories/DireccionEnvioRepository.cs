using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Interfaces;
using Ecommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories;

public class DireccionEnvioRepository : IDireccionEnvioRepository
{
    private readonly ApplicationDbContext _context;

    public DireccionEnvioRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    private static DireccionEnvioDto MapToDto(DireccionEnvio d) => new(
        d.IdDireccion,
        d.IdUsuario,
        d.Calle,
        d.Ciudad,
        d.Departamento,
        d.Pais,
        d.CodigoPostal,
        d.EsPrincipal
    );

    public async Task<IEnumerable<DireccionEnvioDto>> GetByUsuarioIdAsync(int usuarioId)
    {
        return await _context.DireccionesEnvio
            .Where(d => d.IdUsuario == usuarioId)
            .Select(d => MapToDto(d))
            .ToListAsync();
    }

    public async Task<DireccionEnvioDto?> GetByIdAsync(int idDireccion)
    {
        var direccion = await _context.DireccionesEnvio.FindAsync(idDireccion);
        return direccion is null ? null : MapToDto(direccion);
    }

    public async Task<DireccionEnvioDto> CreateAsync(int usuarioId, CreateDireccionEnvioDto dto)
    {
        // Si es principal, quitar el flag de las demás
        if (dto.EsPrincipal)
            await QuitarPrincipalAsync(usuarioId);

        var direccion = new DireccionEnvio
        {
            IdUsuario     = usuarioId,
            Calle         = dto.Calle,
            Ciudad        = dto.Ciudad,
            Departamento  = dto.Departamento,
            Pais          = dto.Pais,
            CodigoPostal  = dto.CodigoPostal,
            EsPrincipal   = dto.EsPrincipal
        };

        _context.DireccionesEnvio.Add(direccion);
        await _context.SaveChangesAsync();
        return MapToDto(direccion);
    }

    public async Task<DireccionEnvioDto?> UpdateAsync(int idDireccion, UpdateDireccionEnvioDto dto)
    {
        var direccion = await _context.DireccionesEnvio.FindAsync(idDireccion);
        if (direccion is null) return null;

        if (dto.EsPrincipal == true)
            await QuitarPrincipalAsync(direccion.IdUsuario);

        if (dto.Calle        is not null) direccion.Calle        = dto.Calle;
        if (dto.Ciudad       is not null) direccion.Ciudad       = dto.Ciudad;
        if (dto.Departamento is not null) direccion.Departamento = dto.Departamento;
        if (dto.Pais         is not null) direccion.Pais         = dto.Pais;
        if (dto.CodigoPostal is not null) direccion.CodigoPostal = dto.CodigoPostal;
        if (dto.EsPrincipal  is not null) direccion.EsPrincipal  = dto.EsPrincipal.Value;

        await _context.SaveChangesAsync();
        return MapToDto(direccion);
    }

    public async Task<bool> DeleteAsync(int idDireccion)
    {
        var direccion = await _context.DireccionesEnvio.FindAsync(idDireccion);
        if (direccion is null) return false;

        _context.DireccionesEnvio.Remove(direccion);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetPrincipalAsync(int idDireccion, int usuarioId)
    {
        var direccion = await _context.DireccionesEnvio.FindAsync(idDireccion);
        if (direccion is null || direccion.IdUsuario != usuarioId) return false;

        await QuitarPrincipalAsync(usuarioId);
        direccion.EsPrincipal = true;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<DireccionEnvioDto?> GetPrincipalAsync(int usuarioId)
    {
        var direccion = await _context.DireccionesEnvio
            .FirstOrDefaultAsync(d => d.IdUsuario == usuarioId && d.EsPrincipal);
        return direccion is null ? null : MapToDto(direccion);
    }

    private async Task QuitarPrincipalAsync(int usuarioId)
    {
        var principales = await _context.DireccionesEnvio
            .Where(d => d.IdUsuario == usuarioId && d.EsPrincipal)
            .ToListAsync();
        principales.ForEach(d => d.EsPrincipal = false);
    }
}
