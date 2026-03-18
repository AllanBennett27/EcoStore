namespace Ecommerce.Domain.Interfaces;

public interface ICartNotificationService
{
    Task NotifyCartUpdatedAsync(string mensaje, int usuarioId);
}