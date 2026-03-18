namespace Ecommerce.Domain.DTOs;

public class UsuarioDto
{
    public int IdUsuario { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public DateTime FechaRegistro { get; set; }
    public string Estado { get; set; } = string.Empty;
    public int IdRol { get; set; }
    public string NombreRol { get; set; } = string.Empty;
}