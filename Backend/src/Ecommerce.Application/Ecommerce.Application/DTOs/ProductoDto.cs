namespace Ecommerce.Application.DTOs;

public class ProductoDto
{
    public int IdProducto { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public decimal Precio { get; set; }
    public string? ImagenUrl { get; set; }
    public string Estado { get; set; } = string.Empty;
    
    public string NombreCategoria { get; set; } = string.Empty;
}