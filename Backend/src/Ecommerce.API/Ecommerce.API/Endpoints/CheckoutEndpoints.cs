using System.Security.Claims;
using Ecommerce.API.Hubs;
using Ecommerce.API.Services;
using Ecommerce.Domain.DTOs;
using Ecommerce.Domain.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient;

namespace Ecommerce.API.Endpoints;

public static class CheckoutEndpoints
{
    public static void MapCheckoutEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapPost("/api/checkout/confirmar", async (
            ConfirmarCompraDto request,
            ICheckoutRepository repo,
            IHubContext<CartHub> hubContext,
            ConcurrenciaLogService concurrenciaLog,
            ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Results.Unauthorized();

            int userId = int.Parse(userIdClaim);

            try
            {
                var result = await repo.ConfirmarCompraAsync(userId, request.IdDireccion, request.IdMetodo);

                await hubContext.Clients.All.SendAsync("StockActualizado", new
                {
                    mensaje = "El inventario ha sido actualizado por una nueva compra.",
                    result.IdPedido,
                    stocks  = result.Stocks,
                });

                return Results.Ok(new { result.IdPedido, total = result.TotalFinal });
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
            catch (SqlException ex)
            {
                var nombreUsuario = user.FindFirst(ClaimTypes.Name)?.Value ?? $"Usuario {userId}";
                concurrenciaLog.Registrar(userId, nombreUsuario, 0, ex.Message);

                await hubContext.Clients.All.SendAsync("ConcurrenciaRollback", new
                {
                    idUsuario     = userId,
                    nombreUsuario,
                    mensaje       = ex.Message,
                    fecha         = DateTime.Now,
                });

                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .RequireAuthorization();

        routes.MapGet("/api/checkout/concurrencia-logs",
            (ConcurrenciaLogService concurrenciaLog) =>
                Results.Ok(concurrenciaLog.ObtenerLogs()))
        .RequireAuthorization();
    }
}
