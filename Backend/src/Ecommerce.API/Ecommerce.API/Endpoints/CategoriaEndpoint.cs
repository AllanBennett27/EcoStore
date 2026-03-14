using Ecommerce.Domain.Interfaces;

namespace Eccomerce.API.Endpoints;

public static class CategoriaEndpoint
{
    public static void MapCategoriaEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/categorias");

        group.MapGet("/", async (ICategoriaRepository repository) =>
            {
                var productos = await repository.GetAllAsync();
                return Results.Ok(productos);
            })
            .WithName("GetCategorias")
            .WithOpenApi();
        
        
    }
}