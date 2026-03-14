namespace Ecommerce.Application.DTOs;

public class AuthDto
{
    public record RegistroRequest(
        string Nombre, 
        string Apellido, 
        string Telefono, 
        string Direccion, 
        string Correo, 
        string Password
    );
    public record LoginRequest(string Email, string Password);
}