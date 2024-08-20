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
        return await _context.Dokumenty.ToListAsync();
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateDokument([FromBody] Dokument newDokument)
    {
        _context.Dokumenty.Add(newDokument);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetDokumenty), new { id = newDokument.Id }, newDokument);
    }

    [HttpGet("produkty")]
    public async Task<ActionResult<IEnumerable<Produkt>>> GetProdukty()
    {
        return await _context.Produkty.ToListAsync();
    }

    [HttpGet("{id}/elements")]
    public async Task<ActionResult<IEnumerable<Element>>> GetElementsByDokumentId(int id)
    {
        var elements = await _context.ElementyDokumentow
            .Where(e => e.DokumentId == id)
            .ToListAsync();
        return Ok(elements);
    }

    [HttpGet("{id}/kontrahenci")]
    public async Task<ActionResult<IEnumerable<Kontrahent>>> GetKontrahenciByDokumentId(int id)
    {
        var kontrahenci = await _context.Kontrahenci
            .Where(k => _context.Dokumenty.Any(d => d.KontrahentId == k.Id && d.Id == id))
            .ToListAsync();
        return Ok(kontrahenci);
    }
}
