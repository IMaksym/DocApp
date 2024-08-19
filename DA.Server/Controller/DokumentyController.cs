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
    [HttpPost]
    public async Task<IActionResult> PostDokument([FromBody] Dokument newDokument)
    {
        _context.Dokumenty.Add(newDokument);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetDokumenty), new { id = newDokument.Id }, newDokument);
    }
    [HttpPost("create")]
    public async Task<IActionResult> CreateDokument([FromBody] Dokument newDokument)
    {
        _context.Dokumenty.Add(newDokument);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetDokumenty), new { id = newDokument.Id }, newDokument);
    }


    [HttpGet("{id}/elements")]
    public async Task<ActionResult<IEnumerable<Element>>> GetElementsByDokumentId(int id)
    {
        var elements = await _context.ElementyDokumentow
            .Where(e => e.DokumentId == id)
            .ToListAsync();

        return Ok(elements);
    }

}
