using System.Security.Claims;
using Ecommerce.API.Hubs;
using Ecommerce.Infrastructure.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Endpoints;

public static class CheckoutEndpoints
{
    public static void MapCheckoutEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapPost("/api/checkout/confirmar", async (
            ApplicationDbContext db,
            IHubContext<CartHub> hubContext,
            ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Results.Unauthorized();

            int userId = int.Parse(userIdClaim);

            try
            {
                // Obtener carrito activo del usuario via ADO.NET
                var conn = db.Database.GetDbConnection();
                if (conn.State != System.Data.ConnectionState.Open)
                    await conn.OpenAsync();

                int carritoId;
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "SELECT TOP 1 id_carrito FROM Carrito WHERE id_usuario = @uid AND estado = 1";
                    cmd.Parameters.Add(new SqlParameter("@uid", userId));
                    var result = await cmd.ExecuteScalarAsync();
                    if (result == null || result == DBNull.Value)
                        return Results.BadRequest(new { error = "No tienes productos en el carrito." });
                    carritoId = (int)result;
                }

                // Llamar SP — THROW en CATCH propaga el error a .NET si hay fallo
                await db.Database.ExecuteSqlRawAsync(
                    "EXEC sp_ConfirmarCompra @p0, @p1", userId, carritoId);

                // Obtener el pedido recién creado
                var pedido = await db.Pedidos
                    .Where(p => p.IdUsuario == userId)
                    .OrderByDescending(p => p.IdPedido)
                    .FirstAsync();

                // Notificar a TODOS los clientes conectados que el stock cambió
                // Esto permite demostrar concurrencia en tiempo real
                await hubContext.Clients.All.SendAsync("StockActualizado", new
                {
                    mensaje = "El inventario ha sido actualizado por una nueva compra.",
                    idPedido = pedido.IdPedido
                });

                return Results.Ok(new { idPedido = pedido.IdPedido, total = pedido.Total });
            }
            catch (SqlException ex)
            {
                // Notificar solo al usuario que falló (ej. stock insuficiente)
                await hubContext.Clients.User(userIdClaim).SendAsync("ErrorCompra", new
                {
                    error = ex.Message
                });

                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .RequireAuthorization();
    }
}
