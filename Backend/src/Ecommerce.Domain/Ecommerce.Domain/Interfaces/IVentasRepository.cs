using Ecommerce.Domain.DTOs;

namespace Ecommerce.Domain.Interfaces;

public interface IVentasRepository
{
    Task<ActualizarEstadoResultDto?> ActualizarEstadoAsync(int idPedido, string nuevoEstado);
}
