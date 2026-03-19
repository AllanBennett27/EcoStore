namespace Ecommerce.Domain.DTOs;

public class InventarioDto
{
    public int IdInventario { get; set; }
    public int IdProducto { get; set; }
    public string NombreProducto { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public int StockActual { get; set; }
    public DateTime FechaActualizacion { get; set; }
    public string EstadoProducto { get; set; } = string.Empty;
}
