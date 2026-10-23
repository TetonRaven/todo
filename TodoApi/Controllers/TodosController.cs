using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using TodoApi.Models;
using TodoApi.Data;

namespace TodoApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TodosController : ControllerBase
{   
    private TodoContext _todoContext;

    public TodosController(TodoContext todoContext)
    {
        _todoContext = todoContext;
    }

    [HttpGet] 
    public async Task<ActionResult<IEnumerable<Todo>>> GetAll()
    {
        return Ok(await _todoContext.Todos.ToListAsync());
    }   

    [HttpGet("{id}")]
    public async Task<ActionResult<Todo>> GetById(int id)
    {
        var todo = await _todoContext.Todos.FindAsync(id);

        if (todo == null)
        {
            return NotFound();
        }        

        return Ok(todo);
    }

    [HttpPost]
    public async Task<ActionResult<Todo>> Create(Todo todo)
    {
        todo.CreatedAt = DateTime.UtcNow;
        _todoContext.Todos.Add(todo);
        await _todoContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = todo.Id }, todo);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Todo todo)
    {
        if (id != todo.Id)
        {
            return BadRequest();
        }

        var existingTodo = await _todoContext.Todos.FindAsync(id);
        if (existingTodo == null)
        {
            return NotFound();
        }

        existingTodo.Text = todo.Text;
        existingTodo.Completed = todo.Completed;

        await _todoContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var todo = await _todoContext.Todos.FindAsync(id);

        if (todo == null)
        {
            return NotFound();
        }

        _todoContext.Todos.Remove(todo);
        await _todoContext.SaveChangesAsync();
        
        return NoContent();
    }
}