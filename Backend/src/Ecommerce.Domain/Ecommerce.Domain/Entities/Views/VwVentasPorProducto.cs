using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Domain.Entities.Views;

[Keyless]
public class VwVentasPorProducto
{
    public int     IdProducto        { get; set; }
    public string  NombreProducto    { get; set; } = string.Empty;
    public int     TotalVendido      { get; set; }
    public decimal IngresosGenerados { get; set; }
}
