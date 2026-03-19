namespace Ecommerce.Domain.DTOs;

public record CarritoItemDto(
    int IdProducto,
    string NombreProducto,
    decimal PrecioUnitario,
    int Cantidad,
    decimal Subtotal,
    string ImagenUrl,
    string NombreCategoria
);
