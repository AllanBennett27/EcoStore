using Microsoft.EntityFrameworkCore;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Entities.Views;

namespace Ecommerce.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Tablas regulares
    public DbSet<Producto>       Productos        { get; set; }
    public DbSet<Categoria>      Categorias       { get; set; }
    public DbSet<Usuario>        Usuarios         { get; set; }
    public DbSet<Rol>            Roles            { get; set; }
    public DbSet<DireccionEnvio> DireccionesEnvio { get; set; }
    public DbSet<MetodoPago>     MetodosPago      { get; set; }
    public DbSet<Favorito>       Favoritos        { get; set; }
    public DbSet<Inventario>     Inventarios      { get; set; }
    public DbSet<DetalleCarrito> DetalleCarritos  { get; set; }
    public DbSet<Pedido>         Pedidos          { get; set; }
    public DbSet<DetallePedido>  DetallePedidos   { get; set; }
    public DbSet<Factura>        Facturas         { get; set; }

    // Vistas (keyless — solo lectura)
    public DbSet<VwVentasPorProducto> VwVentasPorProducto { get; set; }
    public DbSet<VwVentasPorUsuario>  VwVentasPorUsuario  { get; set; }
    public DbSet<VwStockBajo>         VwStockBajo         { get; set; }
    public DbSet<VwDetallePedidos>    VwDetallePedidos    { get; set; }
    public DbSet<VwFacturacion>       VwFacturacion       { get; set; }
    public DbSet<VwCarritosActivos>   VwCarritosActivos   { get; set; }
    public DbSet<VwVentasPorFecha>    VwVentasPorFecha    { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // [Keyless] handles HasNoKey() — only ToView() needed to map the view name
        modelBuilder.Entity<VwVentasPorProducto>().ToView("vw_VentasPorProducto");
        modelBuilder.Entity<VwVentasPorUsuario>() .ToView("vw_VentasPorUsuario");
        modelBuilder.Entity<VwStockBajo>()        .ToView("vw_StockBajo");
        modelBuilder.Entity<VwDetallePedidos>()   .ToView("vw_DetallePedidos");
        modelBuilder.Entity<VwFacturacion>()      .ToView("vw_Facturacion");
        modelBuilder.Entity<VwCarritosActivos>()  .ToView("vw_CarritosActivos");
        modelBuilder.Entity<VwVentasPorFecha>()   .ToView("vw_VentasPorFecha");
    }
}
