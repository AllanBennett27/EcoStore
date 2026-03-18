namespace Ecommerce.Application.DTOs;

public class CarritoRequestDTO
{
    public record CarritoRequest(int ProductoId, int Cantidad, decimal Precio);
}