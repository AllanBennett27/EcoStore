using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Domain.Entities;
[Table("Usuario")]
public class Usuario
{
    [Key]
    [Column("id_usuario")]
    public int IdUsuario { get; set; }

    [Required]
    [StringLength(100)]
    [Column("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    [Column("apellido")]
    public string Apellido { get; set; } = string.Empty;

    [Required]
    [StringLength(150)]
    [EmailAddress] // Validación extra para formato de email
    [Column("correo")]
    public string Correo { get; set; } = string.Empty;

    [Required]
    [StringLength(255)] // Suficiente para un Hash de contraseña (BCrypt/Argon2)
    [Column("contrasenia")]
    public string Contrasenia { get; set; } = string.Empty;

    [StringLength(20)]
    [Phone]
    [Column("telefono")]
    public string? Telefono { get; set; }

    [Required]
    [Column("fecha_registro")]
    public DateTime FechaRegistro { get; set; } = DateTime.Now;

    [Required]
    [StringLength(20)]
    [Column("estado")]
    public string Estado { get; set; } = "Activo";

    // Relación con Rol
    [Required]
    [Column("id_rol")]
    public int IdRol { get; set; }

    [ForeignKey("IdRol")]
    public virtual Rol Rol { get; set; } = null!;
}