using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Ecommerce.API.Hubs;

[Authorize]
public class CartHub : Hub
{
    
}