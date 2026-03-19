using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Domain.Entities.Views;

[Keyless]
public class VwVentasPorFecha
{
    public DateOnly Fecha        { get; set; }
    public int      TotalPedidos { get; set; }
    public decimal  Ingresos     { get; set; }
}
