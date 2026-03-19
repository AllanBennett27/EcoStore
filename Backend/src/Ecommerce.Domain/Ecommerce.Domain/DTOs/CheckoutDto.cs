using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Domain.DTOs;

public record ConfirmarCompraDto(
    [Required] int IdDireccion,
    [Required] int IdMetodo
);

public record ConfirmarCompraResultDto(
    int IdPedido,
    decimal Subtotal,
    decimal Impuesto,
    decimal TotalFinal
);
