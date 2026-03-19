using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Domain.Entities;

[Table("Favorito")]
public class Favorito
{
    [Key]
    [Column("id_favorito")]
    public int IdFavorito { get; set; }

    [Required]
    [Column("id_usuario")]
    public int IdUsuario { get; set; }

    [Required]
    [Column("id_producto")]
    public int IdProducto { get; set; }

    [Required]
    [Column("fecha_agregado")]
    public DateTime FechaAgregado { get; set; } = DateTime.Now;

    [ForeignKey("IdUsuario")]
    public virtual Usuario Usuario { get; set; } = null!;

    [ForeignKey("IdProducto")]
    public virtual Producto Producto { get; set; } = null!;
}
