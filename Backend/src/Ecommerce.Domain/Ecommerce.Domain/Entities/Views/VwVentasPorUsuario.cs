using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Domain.Entities.Views;

[Keyless]
public class VwVentasPorUsuario
{
    public int     IdUsuario    { get; set; }
    public string  Nombre       { get; set; } = string.Empty;
    public string  Apellido     { get; set; } = string.Empty;
    public int     TotalPedidos { get; set; }
    public decimal TotalGastado { get; set; }
}
