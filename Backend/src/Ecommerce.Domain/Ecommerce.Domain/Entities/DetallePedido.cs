using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Domain.Entities;

[Table("DetallePedido")]
public class DetallePedido
{
    [Key]
    [Column("id_detalle_pedido")]
    public int IdDetallePedido { get; set; }
    [Column("id_pedido")]
    public int IdPedido { get; set; }
    [Column("id_producto")]
    public int IdProducto { get; set; }
    [Column("cantidad")]
    public int Cantidad { get; set; }
    [Column("precio_unitario")]
    public decimal PrecioUnitario { get; set; }
    [Column("subtotal")]
    public decimal Subtotal { get; set; }

    // Relaciones
    [ForeignKey("IdPedido")]
    public virtual Pedido Pedido { get; set; } = null!;
    [ForeignKey("IdProducto")]
    public virtual Producto Producto { get; set; } = null!;
}