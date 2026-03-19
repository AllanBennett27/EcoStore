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

        group.MapPost("/registrar", async (
            AuthDto.RegistroRequest req,
            IUsuarioRepository repo,
            IDireccionEnvioRepository direccionRepo) =>
        {
            var existe = await repo.GetByEmailAsync(req.Correo);
            if (existe != null)
                return Results.BadRequest("El correo electrónico ya está registrado.");

            var nuevoUsuario = new Usuario
            {
                Nombre   = req.Nombre,
                Apellido = req.Apellido,
                Telefono = req.Telefono,
                Correo   = req.Correo,
                IdRol    = 2,
                Estado   = "Activo"
            };

            var resultado = await repo.RegistrarAsync(nuevoUsuario, req.Password);
            if (!resultado)
                return Results.BadRequest("No se pudo completar el registro.");

            // Crear dirección principal del usuario recién registrado
            await direccionRepo.CreateAsync(nuevoUsuario.IdUsuario, new CreateDireccionEnvioDto(
                Calle: string.Empty,
                Ciudad: string.Empty,
                Departamento: req.Departamento,
                Pais: req.Pais,
                CodigoPostal: null,
                EsPrincipal: true
            ));

            return Results.Ok("Usuario registrado exitosamente.");
        })
        .WithName("RegistrarUsuario")
        .WithOpenApi();

        group.MapPost("/login", async (
            AuthDto.LoginRequest req,
            IUsuarioRepository repo,
            IDireccionEnvioRepository direccionRepo,
            TokenService tokenService) =>
        {
            var usuario = await repo.ValidarLoginAsync(req.Email, req.Password);
            if (usuario == null) return Results.Unauthorized();

            var token = tokenService.GenerarToken(usuario);

            var direccionPrincipal = await direccionRepo.GetPrincipalAsync(usuario.IdUsuario);

            return Results.Ok(new AuthDto.LoginResponse(
                token,
                usuario.IdUsuario,
                usuario.Nombre,
                usuario.Rol.NombreRol,
                direccionPrincipal?.Ciudad,
                direccionPrincipal?.Pais
            ));
        });
    }
}
