using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Domain.Entities;

public class Factura
{
    [Key]
    [Column("id_factura")]
    public int IdFactura { get; set; }
    [ForeignKey("id_pedido")]
    public int IdPedido { get; set; }
    [Column("fecha_factura")]
    public DateTime FechaFactura { get; set; } = DateTime.Now;
    [Column("subtotal")]
    public decimal Subtotal { get; set; }
    [Column("impuesto")]
    public decimal Impuesto { get; set; }
    [Column("total")]
    public decimal Total { get; set; }

    // Relación: Una factura pertenece a un pedido
    public virtual Pedido Pedido { get; set; } = null!;
}