using Ecommerce.Domain.Interfaces;

namespace Ecommerce.API.Endpoints;

public static class ProductoEndpoints
{
    public static void MapProductoEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/productos");

        group.MapGet("/", async (IProductoRepository repository) =>
            {
                var productos = await repository.GetAllAsync();
                return Results.Ok(productos);
            })
            .WithName("GetProductos")
            .WithOpenApi();
        
        
    }
}