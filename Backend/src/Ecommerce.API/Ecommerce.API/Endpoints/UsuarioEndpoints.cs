using Ecommerce.Domain.Interfaces;
using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Entities;

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
                    FechaRegistro = usuario.FechaRegistro,
                    Estado = usuario.Estado,
                    IdRol = usuario.IdRol,
                    NombreRol = usuario.Rol?.NombreRol ?? string.Empty
                };

                return Results.Ok(usuarioDto);
            })
            .WithName("GetUsuarioById")
            .WithOpenApi();

        // PATCH: Update user role
        group.MapPatch("/role", async (UpdateUserRoleDto dto, IUsuarioRepository repository) =>
            {
                var success = await repository.UpdateUserRoleAsync(dto.IdUsuario, dto.IdRol);
                if (!success)
                    return Results.NotFound(new { message = "Usuario no encontrado" });

                return Results.Ok(new { message = "Rol actualizado exitosamente" });
            })
            .WithName("UpdateUserRole")
            .WithOpenApi();

        // PATCH: Toggle estado Activo/Desactivado
        group.MapPatch("/{id:int}/estado", async (int id, IUsuarioRepository repository) =>
            {
                var success = await repository.ToggleEstadoAsync(id);
                if (!success)
                    return Results.NotFound(new { message = "Usuario no encontrado." });

                return Results.Ok(new { message = "Estado actualizado." });
            })
            .RequireAuthorization("AdminOnly")
            .WithName("ToggleEstadoUsuario")
            .WithOpenApi();

        // POST: Admin crea un usuario con rol específico
        group.MapPost("/", async (CreateUsuarioAdminDto dto, IUsuarioRepository repository) =>
            {
                var existe = await repository.GetByEmailAsync(dto.Correo);
                if (existe != null)
                    return Results.BadRequest(new { message = "El correo ya está registrado." });

                var nuevoUsuario = new Usuario
                {
                    Nombre   = dto.Nombre,
                    Apellido = dto.Apellido,
                    Correo   = dto.Correo,
                    Telefono = dto.Telefono,
                    IdRol    = dto.IdRol,
                    Estado   = "Activo"
                };

                var resultado = await repository.RegistrarAsync(nuevoUsuario, dto.Password);

                return resultado
                    ? Results.Ok(new { message = "Usuario creado exitosamente." })
                    : Results.BadRequest(new { message = "No se pudo crear el usuario." });
            })
            .RequireAuthorization("AdminOnly")
            .WithName("CrearUsuarioAdmin")
            .WithOpenApi();
    }
}