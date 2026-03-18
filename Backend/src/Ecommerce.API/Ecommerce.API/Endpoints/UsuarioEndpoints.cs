using Ecommerce.Domain.Interfaces;
using Ecommerce.Domain.DTOs;

namespace Ecommerce.API.Endpoints;

public static class UsuarioEndpoints
{
    public static void MapUsuarioEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/usuarios");

        // GET: Get all users
        group.MapGet("/", async (IUsuarioRepository repository) =>
            {
                var usuarios = await repository.GetAllUsersAsync();
                return Results.Ok(usuarios);
            })
            .WithName("GetAllUsuarios")
            .WithOpenApi();

        // GET: Get user by ID
        group.MapGet("/{id}", async (int id, IUsuarioRepository repository) =>
            {
                var usuario = await repository.GetByIdAsync(id);
                if (usuario == null)
                    return Results.NotFound(new { message = "Usuario no encontrado" });

                var usuarioDto = new UsuarioDto
                {
                    IdUsuario = usuario.IdUsuario,
                    Nombre = usuario.Nombre,
                    Apellido = usuario.Apellido,
                    Correo = usuario.Correo,
                    Telefono = usuario.Telefono,
                    Direccion = usuario.Direccion,
                    FechaRegistro = usuario.FechaRegistro,
                    Estado = usuario.Estado,
                    IdRol = usuario.IdRol,
                    NombreRol = usuario.Rol?.NombreRol ?? string.Empty
                };

                return Results.Ok(usuarioDto);
            })
            .WithName("GetUsuarioById")
            .WithOpenApi();

        // PUT: Update user role
        group.MapPut("/role", async (UpdateUserRoleDto dto, IUsuarioRepository repository) =>
            {
                var success = await repository.UpdateUserRoleAsync(dto.IdUsuario, dto.IdRol);
                if (!success)
                    return Results.NotFound(new { message = "Usuario no encontrado" });

                return Results.Ok(new { message = "Rol actualizado exitosamente" });
            })
            .WithName("UpdateUserRole")
            .WithOpenApi();
    }
}