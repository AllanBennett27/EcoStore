using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Domain.DTOs;

public class CategoriaDto
{
    public int IdCategoria { get; set; }
    public string NombreCategoria { get; set; }
    public string Descripcion { get; set; }
    public string Estado { get; set; }
}

public record CreateCategoriaDto(
    [Required] string NombreCategoria,
    [Required] string Descripcion
);