using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Domain.Entities;
[Table("Producto")]
public class Producto
{
    [Key]
    [Column("id_producto")]
    public int IdProducto { get; set; }

    [Column("nombre_producto")]
    public string NombreProducto { get; set; } = string.Empty;

    [Column("descripcion")]
    public string? Descripcion { get; set; }

    [Column("precio")]
    public decimal Precio { get; set; }

    [Column("imagen_url")] 
    public string? ImagenUrl { get; set; }

    [Column("estado")]
    public string Estado { get; set; } = "Activo";
    [Column("id_categoria")]
    public int IdCategoria { get; set; }

    [ForeignKey("IdCategoria")]
    public virtual Categoria Categoria { get; set; } = null!;
}