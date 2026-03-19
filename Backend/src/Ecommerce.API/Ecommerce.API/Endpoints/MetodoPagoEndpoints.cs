using System.Security.Claims;
using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Interfaces;

namespace Ecommerce.API.Endpoints;

public static class MetodoPagoEndpoints
{
    public static void MapMetodoPagoEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/metodos-pago").RequireAuthorization();

        // GET /api/metodos-pago - Obtener métodos del usuario autenticado
        group.MapGet("/", async (IMetodoPagoRepository repo, ClaimsPrincipal user) =>
        {
            var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var metodos = await repo.GetByUsuarioIdAsync(usuarioId);
            return Results.Ok(metodos);
        });

        // POST /api/metodos-pago
        group.MapPost("/", async (CreateMetodoPagoDto dto, IMetodoPagoRepository repo, ClaimsPrincipal user) =>
        {
            var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var nuevo = await repo.CreateAsync(usuarioId, dto);
            return Results.Created($"/api/metodos-pago/{nuevo.IdMetodo}", nuevo);
        });

        // DELETE /api/metodos-pago/{id}
        group.MapDelete("/{id:int}", async (int id, IMetodoPagoRepository repo, ClaimsPrincipal user) =>
        {
            var existing = await repo.GetByIdAsync(id);
            if (existing is null) return Results.NotFound();

            var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (existing.IdUsuario != usuarioId) return Results.Forbid();

            await repo.DeleteAsync(id);
            return Results.NoContent();
        });

        // PATCH /api/metodos-pago/{id}/principal
        group.MapPatch("/{id:int}/principal", async (int id, IMetodoPagoRepository repo, ClaimsPrincipal user) =>
        {
            var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var ok = await repo.SetPrincipalAsync(id, usuarioId);
            return ok ? Results.Ok() : Results.NotFound();
        });
    }
}
