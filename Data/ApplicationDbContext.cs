using Microsoft.EntityFrameworkCore;
using RadarClientApp.Models;

namespace RadarClientApp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
    }
}
