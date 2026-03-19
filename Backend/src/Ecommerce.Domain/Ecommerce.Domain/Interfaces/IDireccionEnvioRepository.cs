using Ecommerce.Domain.DTOs;

namespace Ecommerce.Domain.Interfaces;

public interface IDireccionEnvioRepository
{
    Task<IEnumerable<DireccionEnvioDto>> GetByUsuarioIdAsync(int usuarioId);
    Task<DireccionEnvioDto?> GetByIdAsync(int idDireccion);
    Task<DireccionEnvioDto> CreateAsync(int usuarioId, CreateDireccionEnvioDto dto);
    Task<DireccionEnvioDto?> UpdateAsync(int idDireccion, UpdateDireccionEnvioDto dto);
    Task<bool> DeleteAsync(int idDireccion);
    Task<bool> SetPrincipalAsync(int idDireccion, int usuarioId);
    Task<DireccionEnvioDto?> GetPrincipalAsync(int usuarioId);
}
