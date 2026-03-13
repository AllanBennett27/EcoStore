namespace Ecommerce.Domain.Entities;

public class Inventario
{
    public int IdInventario { get; set; }
    public int IdProducto { get; set; }
    public int StockActual { get; set; }
    public DateTime FechaActualizacion { get; set; } = DateTime.Now;

    // Relación: Un registro de inventario pertenece a un producto
    public virtual Producto Producto { get; set; } = null!;
}