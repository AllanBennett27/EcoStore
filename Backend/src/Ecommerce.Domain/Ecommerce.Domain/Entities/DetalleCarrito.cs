using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Domain.Entities;

public enum CarritoEstado
{
    Comprado = 0,
    Activo   = 1,
}

[Table("Carrito")]
public class Carrito
{
    [Key]
    [Column("id_carrito")]
    public int IdCarrito { get; set; }

    [Required]
    [Column("id_usuario")]
    public int IdUsuario { get; set; }

    [Required]
    [Column("fecha_creacion")]
    public DateTime FechaCreacion { get; set; } = DateTime.Now;

    [Required]
    [Column("estado")]
    public CarritoEstado Estado { get; set; } = CarritoEstado.Activo;

    [ForeignKey("IdUsuario")]
    public virtual Usuario Usuario { get; set; } = null!;

    public virtual ICollection<DetalleCarrito> Detalles { get; set; } = new List<DetalleCarrito>();
}

[Table("DetalleCarrito")]
public class DetalleCarrito
{
    [Key]
    [Column("id_detalle_carrito")]
    public int IdDetalleCarrito { get; set; }

    [Required]
    [Column("id_carrito")]
    public int IdCarrito { get; set; }

    [Required]
    [Column("id_producto")]
    public int IdProducto { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    [Column("cantidad")]
    public int Cantidad { get; set; }

    [Required]
    [Column("precio_unitario", TypeName = "decimal(18,2)")]
    public decimal PrecioUnitario { get; set; }

    [Required]
    [Column("subtotal", TypeName = "decimal(18,2)")]
    public decimal Subtotal { get; set; }

    [ForeignKey("IdCarrito")]
    public virtual Carrito Carrito { get; set; } = null!;

    [ForeignKey("IdProducto")]
    public virtual Producto Producto { get; set; } = null!;
}