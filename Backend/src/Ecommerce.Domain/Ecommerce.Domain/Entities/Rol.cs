namespace Ecommerce.Domain.Entities;

public class Rol
{
    public int IdRol { get; set; }
    public string NombreRol { get; set; } = string.Empty;
    public string? Descripcion { get; set; }

    // Un rol puede pertenecer a muchos usuarios
    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}