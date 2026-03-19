using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Domain.Entities.Views;

[Keyless]
public class VwCarritosActivos
{
    public int      IdCarrito     { get; set; }
    public string   Nombre        { get; set; } = string.Empty;
    public string   Apellido      { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; }
    public int      TotalItems    { get; set; }
}
