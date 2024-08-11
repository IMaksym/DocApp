using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class DokumentyController : ControllerBase
{
    private readonly AppDbContext _context;

    public DokumentyController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Dokument>>> GetDokumenty()
    {
        return await _context.Dokumenty
            .ToListAsync();
    }

}
