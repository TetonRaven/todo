using Microsoft.EntityFrameworkCore;

using TodoApi;
using TodoApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

var dbPath =
    Environment.GetEnvironmentVariable("TODO_DB_PATH")
    ?? Path.Combine(AppContext.BaseDirectory, "todo.db");
builder.Services.AddDbContext<TodoContext>(options => options.UseSqlite($"Data Source={dbPath}"));

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("DevCors");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

app.UseExceptionHandler();

app.Run();