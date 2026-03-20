using Ecommerce.API.Hubs;
using Ecommerce.Domain.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace Ecommerce.API.Endpoints;

public static class InventarioEndpoints
{
    public static void MapInventarioEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/inventario");

        // GET: todos los productos con su stock
        group.MapGet("/", async (IInventarioRepository repo) =>
            {
                var stock = await repo.GetAllAsync();
                return Results.Ok(stock);
            })
            .WithName("GetInventario")
            .WithOpenApi();

        // GET: stock de un producto específico
        group.MapGet("/{idProducto:int}", async (int idProducto, IInventarioRepository repo) =>
            {
                var item = await repo.GetByProductoIdAsync(idProducto);
                if (item is null)
                    return Results.NotFound(new { message = "Producto no encontrado en inventario." });

                return Results.Ok(item);
            })
            .WithName("GetStockByProducto")
            .WithOpenApi();

        // PATCH: ajustar stock (+/-)
        group.MapPatch("/{idProducto:int}/ajustar", async (
            int idProducto,
            AjustarStockRequest request,
            IInventarioRepository repo,
            IHubContext<CartHub> hubContext) =>
            {
                var item = await repo.AjustarStockAsync(idProducto, request.Cantidad);
                if (item is null)
                    return Results.NotFound(new { message = "Producto no encontrado en inventario." });

                // Notificar en tiempo real a todos los clientes
                await hubContext.Clients.All.SendAsync("StockActualizado", new
                {
                    stocks = new[] { new { idProducto = item.IdProducto, stockActual = item.StockActual } },
                });

                return Results.Ok(item);
            })
            .RequireAuthorization("AdminOnly");
    }
}

public record AjustarStockRequest(int Cantidad);
