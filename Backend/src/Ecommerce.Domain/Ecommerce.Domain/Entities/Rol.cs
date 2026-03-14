using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Domain.Entities;
[Table("Rol")]
public class Rol
{
    [Key]
    [Column("id_rol")]
    public int IdRol { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre_rol")]
    public string NombreRol { get; set; } = string.Empty;

    [StringLength(255)]
    [Column("descripcion")]
    public string? Descripcion { get; set; } = string.Empty;

    // Relación inversa
    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}