namespace Ecommerce.Domain.Entities;

public class Pedido
{
    public int IdPedido { get; set; }
    public int IdUsuario { get; set; }
    public DateTime FechaPedido { get; set; } = DateTime.Now;
    public string EstadoPedido { get; set; } = "Pendiente";
    public decimal Total { get; set; }

    public virtual Usuario Usuario { get; set; } = null!;
    public virtual ICollection<DetallePedido> Detalles { get; set; } = new List<DetallePedido>();
}