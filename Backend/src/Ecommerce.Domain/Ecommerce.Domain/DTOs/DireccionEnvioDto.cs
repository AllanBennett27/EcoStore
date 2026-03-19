using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Domain.DTOs;

public record DireccionEnvioDto(
    int IdDireccion,
    int IdUsuario,
    string Calle,
    string Ciudad,
    string Departamento,
    string Pais,
    string? CodigoPostal,
    bool EsPrincipal
);

public record CreateDireccionEnvioDto(
    [Required] string Calle,
    [Required] string Ciudad,
    [Required] string Departamento,
    [Required] string Pais,
    string? CodigoPostal,
    bool EsPrincipal = false
);

public record UpdateDireccionEnvioDto(
    string? Calle,
    string? Ciudad,
    string? Departamento,
    string? Pais,
    string? CodigoPostal,
    bool? EsPrincipal
);
