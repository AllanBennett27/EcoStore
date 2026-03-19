using Ecommerce.Domain.Interfaces;

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
    }
}
