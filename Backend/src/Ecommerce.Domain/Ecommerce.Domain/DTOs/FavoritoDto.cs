using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Domain.DTOs;

public record FavoritoDto(
    int IdFavorito,
    int IdProducto,
    string NombreProducto,
    decimal Precio,
    string? ImagenUrl,
    string NombreCategoria,
    DateTime FechaAgregado
);

public record CreateFavoritoDto(
    [Required] int IdProducto
);
