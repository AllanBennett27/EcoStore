using System.Security.Claims;
using Microsoft.AspNetCore.Http; 
using Ecommerce.API.Hubs;
using Ecommerce.Application.DTOs;
using Ecommerce.Domain.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace Ecommerce.API.Endpoints;

public static class CarritoEndpoints
{
    public static void MapCarritoEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/carrito");

        // Dentro de CarritoEndpoints.cs
        group.MapPost("/agregar", async (
                CarritoRequestDTO.CarritoRequest request, 
                ICarritoRepository repo, 
                IHubContext<CartHub> hubContext,
                ClaimsPrincipal user) => 
            {
                try 
                {
          
                    var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                    if (string.IsNullOrEmpty(userIdClaim))
                    {
                        return Results.Unauthorized();
                    }

                    int usuarioId = int.Parse(userIdClaim); 

               
                    await repo.AgregarProductoAsync(
                        usuarioId, 
                        request.ProductoId, 
                        request.Cantidad, 
                        request.Precio
                    );

                   
                    await hubContext.Clients.User(userIdClaim).SendAsync("ReceiveCartUpdate", new {
                        mensaje = "Producto añadido",
                        productoId = request.ProductoId
                    });

                    return Results.Ok(new { mensaje = "Producto añadido al carrito" });
                }
                catch (Exception ex) 
                {
                    return Results.BadRequest(new { error = ex.Message });
                }
            })
            .RequireAuthorization()
            .WithName("AgregarAlCarrito")
            .WithOpenApi();

        group.MapDelete("/eliminar/{productoId:int}", async (
                int productoId,
                ICarritoRepository repo,
                ClaimsPrincipal user) =>
            {
                var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                    return Results.Unauthorized();

                int usuarioId = int.Parse(userIdClaim);

                try
                {
                    await repo.EliminarProductoAsync(usuarioId, productoId);
                    return Results.Ok(new { mensaje = "Producto eliminado del carrito" });
                }
                catch (Exception ex)
                {
                    return Results.BadRequest(new { error = ex.Message });
                }
            })
            .RequireAuthorization()
            .WithName("EliminarDelCarrito")
            .WithOpenApi();
    }
}