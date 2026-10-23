using Microsoft.EntityFrameworkCore;

using TodoApi.Models;

namespace TodoApi.Data;

public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> dbContextOptions) : base(dbContextOptions)
    {                
    }

    public DbSet<Todo> Todos => Set<Todo>();
}