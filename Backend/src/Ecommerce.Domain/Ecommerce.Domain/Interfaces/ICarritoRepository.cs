namespace Ecommerce.Domain.Interfaces;

public interface ICarritoRepository
{
    Task AgregarProductoAsync(int usuarioId, int productoId, int cantidad, decimal precio);
    Task EliminarProductoAsync(int usuarioId, int productoId);
}