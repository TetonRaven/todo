using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

using TodoApi.Controllers;
using TodoApi.Models;
using TodoApi.Data;

namespace TodoApi.Tests.Controllers;

public class TodosControllerTests : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly TodoContext _context;
    private readonly TodosController _controller;

    public TodosControllerTests()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<TodoContext>()
            .UseSqlite(_connection)
            .Options;

        _context = new TodoContext(options);
        _context.Database.EnsureCreated();

        _controller = new TodosController(_context);
    }

    public void Dispose()
    {
        _context.Dispose();
        _connection.Dispose();
    }

    [Fact]
    public async Task GetAll_ReturnsAllTodos()
    {
        _context.Todos.AddRange(
            new Todo { Id = 1, Text = "Write tests", CreatedAt = DateTime.UtcNow, Completed = false },
            new Todo { Id = 2, Text = "Ship feature", CreatedAt = DateTime.UtcNow, Completed = true });
        await _context.SaveChangesAsync();

        var result = await _controller.GetAll();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var todos = Assert.IsAssignableFrom<IEnumerable<Todo>>(okResult.Value);
        Assert.Equal(2, todos.Count());
    }

    [Fact]
    public async Task GetById_WhenTodoExists_ReturnsOkResultWithTodo()
    {
        var todo = new Todo { Id = 1, Text = "Read API", CreatedAt = DateTime.UtcNow, Completed = false };
        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();

        var result = await _controller.GetById(1);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedTodo = Assert.IsType<Todo>(okResult.Value);
        Assert.Equal(1, returnedTodo.Id);
        Assert.Equal("Read API", returnedTodo.Text);
    }

    [Fact]
    public async Task GetById_WhenTodoDoesNotExist_ReturnsNotFound()
    {
        var result = await _controller.GetById(999);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task Create_SetsCreatedAtAndReturnsCreatedAtAction()
    {
        var todo = new Todo { Text = "Create tests", Completed = false };

        var result = await _controller.Create(todo);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal(nameof(TodosController.GetById), createdResult.ActionName);

        var createdTodo = Assert.IsType<Todo>(createdResult.Value);
        Assert.NotEqual(default, createdTodo.CreatedAt);
        Assert.Equal(todo.Text, createdTodo.Text);
        Assert.NotEqual(0, createdTodo.Id);
        Assert.Equal(createdTodo.Id, createdResult.RouteValues!["id"]);
    }

    [Fact]
    public async Task Update_WhenIdsDoNotMatch_ReturnsBadRequest()
    {
        var todo = new Todo { Id = 3, Text = "Mismatch", CreatedAt = DateTime.UtcNow, Completed = false };

        var result = await _controller.Update(4, todo);

        Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public async Task Update_WhenTodoExists_UpdatesAndReturnsNoContent()
    {
        var original = new Todo { Id = 5, Text = "Old text", CreatedAt = DateTime.UtcNow.AddDays(-1), Completed = false };
        _context.Todos.Add(original);
        await _context.SaveChangesAsync();
        _context.Entry(original).State = EntityState.Detached;

        var updatedTodo = new Todo { Id = 5, Text = "New text", CreatedAt = original.CreatedAt, Completed = true };

        var result = await _controller.Update(5, updatedTodo);

        Assert.IsType<NoContentResult>(result);
        var savedTodo = await _context.Todos.FindAsync(5);
        Assert.Equal("New text", savedTodo!.Text);
        Assert.True(savedTodo.Completed);
    }

    [Fact]
    public async Task Update_WhenTodoDoesNotExist_ReturnsNotFound()
    {
        var todo = new Todo { Id = 99, Text = "Missing item", CreatedAt = DateTime.UtcNow, Completed = false };

        var result = await _controller.Update(99, todo);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Delete_WhenTodoExists_ReturnsNoContent()
    {
        var todo = new Todo { Id = 7, Text = "Delete me", CreatedAt = DateTime.UtcNow, Completed = false };
        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();

        var result = await _controller.Delete(todo.Id);

        Assert.IsType<NoContentResult>(result);
        Assert.Null(await _context.Todos.FindAsync(todo.Id));
    }

    [Fact]
    public async Task Delete_WhenTodoDoesNotExist_ReturnsNotFound()
    {
        var result = await _controller.Delete(999);

        Assert.IsType<NotFoundResult>(result);
    }
}
