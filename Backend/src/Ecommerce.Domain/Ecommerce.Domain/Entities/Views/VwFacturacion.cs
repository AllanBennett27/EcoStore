using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Domain.Entities.Views;

[Keyless]
public class VwFacturacion
{
    public int      IdFactura    { get; set; }
    public DateTime FechaFactura { get; set; }
    public string   Cliente      { get; set; } = string.Empty;
    public decimal  Subtotal     { get; set; }
    public decimal  Impuesto     { get; set; }
    public decimal  Total        { get; set; }
}
