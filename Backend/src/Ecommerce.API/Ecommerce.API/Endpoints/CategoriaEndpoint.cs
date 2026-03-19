using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Interfaces;

namespace Eccomerce.API.Endpoints;

public static class CategoriaEndpoint
{
    public static void MapCategoriaEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/categorias");

        group.MapGet("/", async (ICategoriaRepository repository) =>
            {
                var categorias = await repository.GetAllAsync();
                return Results.Ok(categorias);
            })
            .WithName("GetCategorias")
            .WithOpenApi();

        group.MapPost("/", async (CreateCategoriaDto dto, ICategoriaRepository repository) =>
            {
                var nueva = await repository.CreateAsync(dto);
                return Results.Created($"/api/categorias/{nueva.IdCategoria}", nueva);
            })
            .WithName("CreateCategoria")
            .WithOpenApi()
            .RequireAuthorization();
    }
}