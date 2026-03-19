using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Domain.Entities;

[Table("Inventario")]
public class Inventario
{
    [Key]
    [Column("id_inventario")]
    public int IdInventario { get; set; }
    [Column("id_producto")]
    public int IdProducto { get; set; }
    [Column("stock_actual")]
    public int StockActual { get; set; }
    [Column("fecha_actualizacion")]
    public DateTime FechaActualizacion { get; set; } = DateTime.Now;

    // Relación: Un registro de inventario pertenece a un producto
    [ForeignKey("IdProducto")]
    public virtual Producto Producto { get; set; } = null!;
}