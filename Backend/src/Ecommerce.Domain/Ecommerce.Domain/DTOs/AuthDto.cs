namespace Ecommerce.Domain.DTOs;

public class AuthDto
{
    public record RegistroRequest(
        string Nombre,
        string Apellido,
        string Telefono,
        string Correo,
        string Password,
        string Departamento,
        string Pais
    );

    public record LoginRequest(string Email, string Password);

    public record LoginResponse(
        string Token,
        int IdUsuario,
        string Nombre,
        string NombreRol,
        string? Ciudad,
        string? Pais
    );
}
