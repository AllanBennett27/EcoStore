namespace Ecommerce.Domain.Entities;

public class Categoria
{
    public int IdCategoria { get; set; }
    public string NombreCategoria { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string Estado { get; set; } = "Activo";

    // Un categoría puede tener muchos productos
    public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
}