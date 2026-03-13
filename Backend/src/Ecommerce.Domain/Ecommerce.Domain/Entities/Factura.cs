namespace Ecommerce.Domain.Entities;

public class Factura
{
    public int IdFactura { get; set; }
    public int IdPedido { get; set; }
    public DateTime FechaFactura { get; set; } = DateTime.Now;
    public decimal Subtotal { get; set; }
    public decimal Impuesto { get; set; }
    public decimal Total { get; set; }

    // Relación: Una factura pertenece a un pedido
    public virtual Pedido Pedido { get; set; } = null!;
}