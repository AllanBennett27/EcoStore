namespace Ecommerce.Domain.Entities;

public class Carrito
{
    public int IdCarrito { get; set; }
    public int IdUsuario { get; set; }
    public DateTime FechaCreacion { get; set; } = DateTime.Now;
    public string Estado { get; set; } = "Activo";

    public virtual Usuario Usuario { get; set; } = null!;
    public virtual ICollection<DetalleCarrito> Detalles { get; set; } = new List<DetalleCarrito>();
}

public class DetalleCarrito
{
    public int IdDetalleCarrito { get; set; }
    public int IdCarrito { get; set; }
    public int IdProducto { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Subtotal { get; set; }

    public virtual Carrito Carrito { get; set; } = null!;
    public virtual Producto Producto { get; set; } = null!;
}