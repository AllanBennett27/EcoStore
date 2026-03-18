using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Domain.DTOs;

public class UpdateUserRoleDto
{
    [Required]
    public int IdUsuario { get; set; }

    [Required]
    public int IdRol { get; set; }
}