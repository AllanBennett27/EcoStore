using Ecommerce.Domain.Interfaces;

namespace Ecommerce.API.Endpoints;

public static class ViewsEndpoints
{
    public static void MapViewsEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/views").RequireAuthorization();

        // GET /api/views/ventas-por-producto
        group.MapGet("/ventas-por-producto", async (IViewsRepository repo) =>
            Results.Ok(await repo.GetVentasPorProductoAsync()));

        // GET /api/views/ventas-por-usuario
        group.MapGet("/ventas-por-usuario", async (IViewsRepository repo) =>
            Results.Ok(await repo.GetVentasPorUsuarioAsync()));

        // GET /api/views/stock-bajo
        group.MapGet("/stock-bajo", async (IViewsRepository repo) =>
            Results.Ok(await repo.GetStockBajoAsync()));

        // GET /api/views/detalle-pedidos
        group.MapGet("/detalle-pedidos", async (IViewsRepository repo) =>
            Results.Ok(await repo.GetDetallePedidosAsync()));

        // GET /api/views/detalle-pedidos/{idPedido}
        group.MapGet("/detalle-pedidos/{idPedido:int}", async (int idPedido, IViewsRepository repo) =>
            Results.Ok(await repo.GetDetallePedidosByIdAsync(idPedido)));

        // GET /api/views/facturacion
        group.MapGet("/facturacion", async (IViewsRepository repo) =>
            Results.Ok(await repo.GetFacturacionAsync()));

        // GET /api/views/carritos-activos
        group.MapGet("/carritos-activos", async (IViewsRepository repo) =>
            Results.Ok(await repo.GetCarritosActivosAsync()));

        // GET /api/views/ventas-por-fecha
        group.MapGet("/ventas-por-fecha", async (IViewsRepository repo) =>
            Results.Ok(await repo.GetVentasPorFechaAsync()));
    }
}
