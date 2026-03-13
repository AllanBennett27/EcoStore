namespace Ecommerce.Domain.Entities;

public class Producto
{
    public int IdProducto { get; set; } // Llave Primaria
    public string NombreProducto { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public decimal Precio { get; set; }
    public string? ImagenUrl { get; set; }
    public int IdCategoria { get; set; } // Llave Foránea
    public string Estado { get; set; } = "Activo";

    // Propiedades de navegación (Para que EF entienda las relaciones)
    public virtual Categoria Categoria { get; set; } = null!;
}