namespace Ecommerce.Domain.DTOs;

public class UpdateProductoDto
{
    public string? Nombre { get; set; }
    public string? Descripcion { get; set; }
    public decimal? Precio { get; set; }
    public string? ImagenUrl { get; set; }
    public int? IdCategoria { get; set; }
    public string? Estado { get; set; }
}
