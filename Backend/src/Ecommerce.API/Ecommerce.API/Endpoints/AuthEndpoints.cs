using Ecommerce.Application.Services;
using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Interfaces;

namespace Ecommerce.API.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/auth");

        group.MapPost("/registrar", async (AuthDto.RegistroRequest req, IUsuarioRepository repo) =>
            {
              
                var existe = await repo.GetByEmailAsync(req.Correo);
                if (existe != null) 
                    return Results.BadRequest("El correo electrónico ya está registrado.");

               
                var nuevoUsuario = new Usuario
                {
                    Nombre = req.Nombre,
                    Apellido = req.Apellido, 
                    Telefono = req.Telefono, 
                    Direccion = req.Direccion, 
                    Correo = req.Correo,
                    IdRol = 2, 
                    Estado = "Activo"
                };

                var resultado = await repo.RegistrarAsync(nuevoUsuario, req.Password);

                return resultado 
                    ? Results.Ok("Usuario registrado exitosamente.") 
                    : Results.BadRequest("No se pudo completar el registro.");
            })
            .WithName("RegistrarUsuario")
            .WithOpenApi();
        group.MapPost("/login", async (AuthDto.LoginRequest req, IUsuarioRepository repo, TokenService tokenService) =>
        {
            var usuario = await repo.ValidarLoginAsync(req.Email, req.Password);

            if (usuario == null) return Results.Unauthorized();

            // Generamos el token real
            var token = tokenService.GenerarToken(usuario);

            return Results.Ok(new
            {
                Token = token
            });
        });
    }
   
}