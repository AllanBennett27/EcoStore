using Ecommerce.Domain.DTOs;

namespace Ecommerce.Domain.Interfaces;

public interface ICheckoutRepository
{
    Task<ConfirmarCompraResultDto> ConfirmarCompraAsync(int idUsuario, int idDireccion, int idMetodo);
}
