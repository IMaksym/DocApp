using DA.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Newtonsoft.Json;

[ApiController]
[Route("api/[controller]")]
public class DokumentyController : ControllerBase
{
    private readonly AppDbContext _context;

    public DokumentyController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("produkty")]
    public async Task<IActionResult> GetProdukty()
    {
        var produkty = await _context.Produkty.ToListAsync();
        return Ok(produkty);
    }

    [HttpGet("dokumenty")]
    public async Task<IActionResult> GetDokumenty()
    {
        var dokumenty = await _context.Dokumenty
            .Include(d => d.Kontrahent)
            .Include(d => d.ElementyDokumentow)
            .ThenInclude(ed => ed.Produkt)
            .ToListAsync();
        return Ok(dokumenty);
    }

    [HttpPost("dokument")]
    public async Task<IActionResult> CreateDokument([FromBody] CreateDokumentDto createDokumentDto)
    {
        if (createDokumentDto == null)
        {
            return BadRequest("Dokument is null.");
        }

        var dokument = new Dokument
        {
            TypDokumentu = createDokumentDto.TypDokumentu,
            DokumentPowiazanyId = createDokumentDto.DokumentPowiazanyId
        };

        if (createDokumentDto.Kontrahent != null)
        {
            var kontrahent = new Kontrahent
            {
                Nazwa = createDokumentDto.Kontrahent.Nazwa,
                Adres = createDokumentDto.Kontrahent.Adres,
                Telefon = createDokumentDto.Kontrahent.Telefon
            };
            _context.Kontrahenci.Add(kontrahent);
            await _context.SaveChangesAsync();
            dokument.KontrahentId = kontrahent.Id;
        }

        foreach (var item in createDokumentDto.ElementyDokumentow)
        {
            var element = new ElementyDokumentow
            {
                ProduktId = item.ProduktId,
                Ilosc = item.Ilosc,
                Dokument = dokument
            };
            _context.Elementy_dokumentow.Add(element);
        }

        _context.Dokumenty.Add(dokument);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDokumenty), new { id = dokument.Id }, dokument);
    }
}
