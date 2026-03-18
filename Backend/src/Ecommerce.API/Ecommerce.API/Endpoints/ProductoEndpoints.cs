using Ecommerce.Domain.DTOs;
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

        group.MapGet("/activos", async (IProductoRepository repository) =>
            {
                var productos = await repository.GetActiveAsync();
                return Results.Ok(productos);
            })
            .WithName("GetProductosActivos")
            .WithOpenApi();

        group.MapGet("/{id:int}", async (int id, IProductoRepository repository) =>
            {
                var producto = await repository.GetByIdAsync(id);
                return producto is null
                    ? Results.NotFound($"Producto con ID {id} no encontrado")
                    : Results.Ok(producto);
            })
            .WithName("GetProductoById")
            .WithOpenApi();

        group.MapPost("/", async (CreateProductoDto createDto, IProductoRepository repository) =>
            {
                var nuevoProducto = await repository.CreateAsync(createDto);
                return Results.Created($"/api/productos/{nuevoProducto.IdProducto}", nuevoProducto);
            })
            .WithName("CreateProducto")
            .WithOpenApi();

        group.MapPut("/{id:int}", async (int id, UpdateProductoDto updateDto, IProductoRepository repository) =>
            {
                var actualizado = await repository.UpdateAsync(id, updateDto);
                return actualizado
                    ? Results.Ok(new { mensaje = "Producto actualizado correctamente" })
                    : Results.NotFound($"Producto con ID {id} no encontrado");
            })
            .WithName("UpdateProducto")
            .WithOpenApi();

        group.MapPatch("/{id:int}/ocultar", async (int id, IProductoRepository repository) =>
            {
                var actualizado = await repository.ChangeStatusAsync(id, "Inactivo");
                return actualizado
                    ? Results.Ok(new { mensaje = "Producto ocultado correctamente" })
                    : Results.NotFound($"Producto con ID {id} no encontrado");
            })
            .WithName("HideProducto")
            .WithOpenApi();

        group.MapPatch("/{id:int}/activar", async (int id, IProductoRepository repository) =>
            {
                var actualizado = await repository.ChangeStatusAsync(id, "Activo");
                return actualizado
                    ? Results.Ok(new { mensaje = "Producto activado correctamente" })
                    : Results.NotFound($"Producto con ID {id} no encontrado");
            })
            .WithName("ActivateProducto")
            .WithOpenApi();
    }
}
