using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Domain.Entities.Views;

[Keyless]
public class VwDetallePedidos
{
    public int      IdPedido       { get; set; }
    public string   Cliente        { get; set; } = string.Empty;
    public DateTime FechaPedido    { get; set; }
    public string   EstadoPedido   { get; set; } = string.Empty;
    public string   NombreProducto { get; set; } = string.Empty;
    public int      Cantidad       { get; set; }
    public decimal  PrecioUnitario { get; set; }
    public decimal  Subtotal       { get; set; }
}
