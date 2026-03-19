using System.Security.Claims;
using Ecommerce.API.Hubs;
using Ecommerce.Domain.DTOs;
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
            ConfirmarCompraDto request,
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
                var conn = db.Database.GetDbConnection();
                if (conn.State != System.Data.ConnectionState.Open)
                    await conn.OpenAsync();

                // Obtener carrito activo del usuario
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

                // Llamar SP con los 4 parámetros requeridos
                int idPedido = 0;
                decimal totalFinal = 0;
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "EXEC sp_ConfirmarCompra @id_usuario, @id_carrito, @id_direccion, @id_metodo";
                    cmd.Parameters.Add(new SqlParameter("@id_usuario",   userId));
                    cmd.Parameters.Add(new SqlParameter("@id_carrito",   carritoId));
                    cmd.Parameters.Add(new SqlParameter("@id_direccion", request.IdDireccion));
                    cmd.Parameters.Add(new SqlParameter("@id_metodo",    request.IdMetodo));

                    using var reader = await cmd.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        idPedido    = reader.GetInt32(reader.GetOrdinal("id_pedido"));
                        totalFinal  = reader.GetDecimal(reader.GetOrdinal("total_final"));
                    }
                    else
                    {
                        // Si el SP devolvió un mensaje de error en lugar de un resultado
                        return Results.BadRequest(new { error = "Error al procesar el pedido." });
                    }
                }

                // Notificar a TODOS los clientes que el stock cambió (demostración concurrencia)
                await hubContext.Clients.All.SendAsync("StockActualizado", new
                {
                    mensaje = "El inventario ha sido actualizado por una nueva compra.",
                    idPedido
                });

                return Results.Ok(new { idPedido, total = totalFinal });
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
