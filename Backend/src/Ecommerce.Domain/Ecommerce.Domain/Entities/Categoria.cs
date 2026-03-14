using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Domain.Entities;
[Table("Categoria")]
public class Categoria
{
    [Key]
    [Column("id_categoria")]
    public int IdCategoria { get; set; }
    [Column("nombre_categoria")]
    public string NombreCategoria { get; set; } = string.Empty;
    [Column("descripcion")]
    public string? Descripcion { get; set; }
    [Column("estado")]
    public string Estado { get; set; } = "Activo";

    [InverseProperty("Categoria")]
    public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
}