namespace Ecommerce.Domain.Entities;

public class Usuario
{
    public int IdUsuario { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Contrasenia { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public DateTime FechaRegistro { get; set; } = DateTime.Now;
    public string Estado { get; set; } = "Activo";
    
    // Relación con Rol
    public int IdRol { get; set; }
    public virtual Rol Rol { get; set; } = null!;
}