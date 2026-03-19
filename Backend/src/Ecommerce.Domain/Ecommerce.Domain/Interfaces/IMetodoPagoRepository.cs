using Ecommerce.Domain.DTOs;

namespace Ecommerce.Domain.Interfaces;

public interface IMetodoPagoRepository
{
    Task<IEnumerable<MetodoPagoDto>> GetByUsuarioIdAsync(int usuarioId);
    Task<MetodoPagoDto?> GetByIdAsync(int idMetodo);
    Task<MetodoPagoDto> CreateAsync(int usuarioId, CreateMetodoPagoDto dto);
    Task<bool> DeleteAsync(int idMetodo);
    Task<bool> SetPrincipalAsync(int idMetodo, int usuarioId);
}
