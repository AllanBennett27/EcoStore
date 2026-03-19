using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Domain.Entities;

[Table("DireccionEnvio")]
public class DireccionEnvio
{
    [Key]
    [Column("id_direccion")]
    public int IdDireccion { get; set; }

    [Required]
    [Column("id_usuario")]
    public int IdUsuario { get; set; }

    [Required]
    [StringLength(200)]
    [Column("calle")]
    public string Calle { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    [Column("ciudad")]
    public string Ciudad { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    [Column("departamento")]
    public string Departamento { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    [Column("pais")]
    public string Pais { get; set; } = "Honduras";

    [StringLength(10)]
    [Column("codigo_postal")]
    public string? CodigoPostal { get; set; }

    [Required]
    [Column("es_principal")]
    public bool EsPrincipal { get; set; } = false;

    [ForeignKey("IdUsuario")]
    public virtual Usuario Usuario { get; set; } = null!;
}
