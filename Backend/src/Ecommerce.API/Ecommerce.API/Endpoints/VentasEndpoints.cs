using Ecommerce.API.Hubs;
using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient;

namespace Ecommerce.API.Endpoints;

public static class VentasEndpoints
{
    public static void MapVentasEndpoints(this IEndpointRouteBuilder routes)
    {
        // PUT /api/ventas/pedidos/{id}/estado
        routes.MapPut("/api/ventas/pedidos/{id:int}/estado", async (
            int id,
            ActualizarEstadoRequestDto request,
            IVentasRepository repo,
            IHubContext<CartHub> hubContext) =>
        {
            try
            {
                var result = await repo.ActualizarEstadoAsync(id, request.NuevoEstado);

                if (result is null)
                    return Results.BadRequest(new { error = "No se pudo actualizar el estado." });

                if (result.Resultado == "OK")
                {
                    await hubContext.Clients.All.SendAsync("EstadoPedidoActualizado", new
                    {
                        idPedido    = result.IdPedido,
                        nuevoEstado = result.EstadoNuevo,
                    });
                }

                return Results.Ok(result);
            }
            catch (SqlException ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .RequireAuthorization();
    }
}
