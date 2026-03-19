using System.Security.Claims;
using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Interfaces;

namespace Ecommerce.API.Endpoints;

public static class DireccionEnvioEndpoints
{
    public static void MapDireccionEnvioEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/direcciones").RequireAuthorization();

        // GET /api/direcciones - Obtener direcciones del usuario autenticado
        group.MapGet("/", async (IDireccionEnvioRepository repo, ClaimsPrincipal user) =>
        {
            var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var direcciones = await repo.GetByUsuarioIdAsync(usuarioId);
            return Results.Ok(direcciones);
        });

        // GET /api/direcciones/{id}
        group.MapGet("/{id:int}", async (int id, IDireccionEnvioRepository repo, ClaimsPrincipal user) =>
        {
            var direccion = await repo.GetByIdAsync(id);
            if (direccion is null) return Results.NotFound();

            var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (direccion.IdUsuario != usuarioId) return Results.Forbid();

            return Results.Ok(direccion);
        });

        // POST /api/direcciones
        group.MapPost("/", async (CreateDireccionEnvioDto dto, IDireccionEnvioRepository repo, ClaimsPrincipal user) =>
        {
            var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var nueva = await repo.CreateAsync(usuarioId, dto);
            return Results.Created($"/api/direcciones/{nueva.IdDireccion}", nueva);
        });

        // PUT /api/direcciones/{id}
        group.MapPut("/{id:int}", async (int id, UpdateDireccionEnvioDto dto, IDireccionEnvioRepository repo, ClaimsPrincipal user) =>
        {
            var existing = await repo.GetByIdAsync(id);
            if (existing is null) return Results.NotFound();

            var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (existing.IdUsuario != usuarioId) return Results.Forbid();

            var actualizada = await repo.UpdateAsync(id, dto);
            return Results.Ok(actualizada);
        });

        // DELETE /api/direcciones/{id}
        group.MapDelete("/{id:int}", async (int id, IDireccionEnvioRepository repo, ClaimsPrincipal user) =>
        {
            var existing = await repo.GetByIdAsync(id);
            if (existing is null) return Results.NotFound();

            var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (existing.IdUsuario != usuarioId) return Results.Forbid();

            await repo.DeleteAsync(id);
            return Results.NoContent();
        });

        // PATCH /api/direcciones/{id}/principal
        group.MapPatch("/{id:int}/principal", async (int id, IDireccionEnvioRepository repo, ClaimsPrincipal user) =>
        {
            var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var ok = await repo.SetPrincipalAsync(id, usuarioId);
            return ok ? Results.Ok() : Results.NotFound();
        });
    }
}
