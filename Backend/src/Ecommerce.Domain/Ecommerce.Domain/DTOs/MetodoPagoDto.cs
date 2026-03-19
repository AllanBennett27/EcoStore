using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Domain.DTOs;

public record MetodoPagoDto(
    int IdMetodo,
    int IdUsuario,
    string Tipo,
    string? Proveedor,
    string? UltimosDigitos,
    bool EsPrincipal
);

public record CreateMetodoPagoDto(
    [Required] string Tipo,
    string? Proveedor,
    string? UltimosDigitos,
    bool EsPrincipal = false
);
