using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Domain.Entities;

public class DetallePedido
{
    [Key]
    public int IdDetallePedido { get; set; }
    public int IdPedido { get; set; }
    public int IdProducto { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Subtotal { get; set; }

    // Relaciones
    public virtual Pedido Pedido { get; set; } = null!;
    public virtual Producto Producto { get; set; } = null!;
}