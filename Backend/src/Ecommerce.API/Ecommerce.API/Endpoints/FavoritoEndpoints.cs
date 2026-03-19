using System.Security.Claims;
using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Interfaces;

namespace Ecommerce.API.Endpoints;

public static class FavoritoEndpoints
{
    public static void MapFavoritoEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/favoritos").RequireAuthorization();

        // GET /api/favoritos - Obtener favoritos del usuario autenticado
        group.MapGet("/", async (IFavoritoRepository repo, ClaimsPrincipal user) =>
        {
            var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var favoritos = await repo.GetByUsuarioIdAsync(usuarioId);
            return Results.Ok(favoritos);
        });

        // GET /api/favoritos/{idProducto}/check - Verificar si un producto es favorito
        group.MapGet("/{idProducto:int}/check", async (int idProducto, IFavoritoRepository repo, ClaimsPrincipal user) =>
        {
            var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var esFavorito = await repo.IsFavoritoAsync(usuarioId, idProducto);
            return Results.Ok(new { esFavorito });
        });

        // POST /api/favoritos
        group.MapPost("/", async (CreateFavoritoDto dto, IFavoritoRepository repo, ClaimsPrincipal user) =>
        {
            var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var yaExiste = await repo.IsFavoritoAsync(usuarioId, dto.IdProducto);
            if (yaExiste) return Results.Conflict(new { mensaje = "El producto ya está en favoritos." });

            var favorito = await repo.AddAsync(usuarioId, dto.IdProducto);
            return Results.Created($"/api/favoritos", favorito);
        });

        // DELETE /api/favoritos/{idProducto}
        group.MapDelete("/{idProducto:int}", async (int idProducto, IFavoritoRepository repo, ClaimsPrincipal user) =>
        {
            var usuarioId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var ok = await repo.RemoveAsync(usuarioId, idProducto);
            return ok ? Results.NoContent() : Results.NotFound();
        });
    }
}
