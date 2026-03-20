namespace Ecommerce.Domain.DTOs;

public record ActualizarEstadoRequestDto(string NuevoEstado);

public record ActualizarEstadoResultDto(int IdPedido, string EstadoNuevo, string Resultado);
