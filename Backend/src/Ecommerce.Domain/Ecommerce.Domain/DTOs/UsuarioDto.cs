using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Domain.DTOs;

public class CreateUsuarioAdminDto
{
    [Required] public string Nombre    { get; set; } = string.Empty;
    [Required] public string Apellido  { get; set; } = string.Empty;
    [Required] public string Correo    { get; set; } = string.Empty;
    [Required] public string Password  { get; set; } = string.Empty;
    public string? Telefono  { get; set; }
    [Required] public int IdRol { get; set; }
}

public class UsuarioDto
{
    public int IdUsuario { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public DateTime FechaRegistro { get; set; }
    public string Estado { get; set; } = string.Empty;
    public int IdRol { get; set; }
    public string NombreRol { get; set; } = string.Empty;
}