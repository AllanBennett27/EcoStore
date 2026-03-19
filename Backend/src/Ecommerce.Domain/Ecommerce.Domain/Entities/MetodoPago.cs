using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Domain.Entities;

[Table("MetodoPago")]
public class MetodoPago
{
    [Key]
    [Column("id_metodo")]
    public int IdMetodo { get; set; }

    [Required]
    [Column("id_usuario")]
    public int IdUsuario { get; set; }

    [Required]
    [StringLength(50)]
    [Column("tipo")]
    public string Tipo { get; set; } = string.Empty; // 'Tarjeta', 'PayPal', 'Efectivo'

    [StringLength(50)]
    [Column("proveedor")]
    public string? Proveedor { get; set; } // 'Visa', 'Mastercard', 'Amex'

    [StringLength(4)]
    [Column("ultimos_digitos")]
    public string? UltimosDigitos { get; set; }

    [Required]
    [Column("es_principal")]
    public bool EsPrincipal { get; set; } = false;

    [ForeignKey("IdUsuario")]
    public virtual Usuario Usuario { get; set; } = null!;
}
