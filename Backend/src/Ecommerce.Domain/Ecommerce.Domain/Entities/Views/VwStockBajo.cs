using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Domain.Entities.Views;

[Keyless]
public class VwStockBajo
{
    public int    IdProducto     { get; set; }
    public string NombreProducto { get; set; } = string.Empty;
    public int    StockActual    { get; set; }
}
