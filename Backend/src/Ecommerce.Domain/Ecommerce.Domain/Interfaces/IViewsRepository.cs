using Ecommerce.Domain.Entities.Views;

namespace Ecommerce.Domain.Interfaces;

public interface IViewsRepository
{
    Task<IEnumerable<VwVentasPorProducto>> GetVentasPorProductoAsync();
    Task<IEnumerable<VwVentasPorUsuario>>  GetVentasPorUsuarioAsync();
    Task<IEnumerable<VwStockBajo>>         GetStockBajoAsync();
    Task<IEnumerable<VwDetallePedidos>>    GetDetallePedidosAsync();
    Task<IEnumerable<VwDetallePedidos>>    GetDetallePedidosByIdAsync(int idPedido);
    Task<IEnumerable<VwFacturacion>>       GetFacturacionAsync();
    Task<IEnumerable<VwCarritosActivos>>   GetCarritosActivosAsync();
    Task<IEnumerable<VwVentasPorFecha>>    GetVentasPorFechaAsync();
}
