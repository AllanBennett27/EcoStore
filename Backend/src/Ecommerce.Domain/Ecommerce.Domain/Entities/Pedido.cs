using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Domain.Entities;

[Table("Pedido")]
public class Pedido
{
    [Key]
    [Column("id_pedido")]
    public int IdPedido { get; set; }

    [Required]
    [Column("id_usuario")]
    public int IdUsuario { get; set; }

    [Required]
    [Column("id_direccion")]
    public int IdDireccion { get; set; }

    [Required]
    [Column("id_metodo")]
    public int IdMetodo { get; set; }

    [Required]
    [Column("fecha_pedido")]
    public DateTime FechaPedido { get; set; } = DateTime.Now;

    [Required]
    [StringLength(20)]
    [Column("estado_pedido")]
    public string EstadoPedido { get; set; } = "Pendiente";

    [Required]
    [Column("total")]
    public decimal Total { get; set; }

    [ForeignKey("IdUsuario")]
    public virtual Usuario Usuario { get; set; } = null!;

    [ForeignKey("IdDireccion")]
    public virtual DireccionEnvio DireccionEnvio { get; set; } = null!;

    [ForeignKey("IdMetodo")]
    public virtual MetodoPago MetodoPago { get; set; } = null!;

    public virtual ICollection<DetallePedido> Detalles { get; set; } = new List<DetallePedido>();
}
