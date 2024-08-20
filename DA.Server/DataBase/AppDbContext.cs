using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text.Json.Serialization;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options)
    {
    }

    public DbSet<Dokument> Dokumenty { get; set; }
    public DbSet<Element> ElementyDokumentow { get; set; }
    public DbSet<Kontrahent> Kontrahenci { get; set; }
    public DbSet<Produkt> Produkty { get; set; }
}

public class Dokument
{
    public int Id { get; set; }
    public string Typ { get; set; }
    public DateTime Data { get; set; }

    [JsonIgnore]
    public int? KontrahentId { get; set; }
    public Kontrahent Kontrahent { get; set; }
    public ICollection<Element> ElementyDokumentow { get; set; } = new List<Element>();
}

public class Element
{
    public int Id { get; set; }
    public int DokumentId { get; set; }
    public string NazwaProduktu { get; set; }
    public int Ilosc { get; set; }
    public Dokument Dokument { get; set; }
}

public class Kontrahent
{
    public int Id { get; set; }
    public string Nazwa { get; set; }
    public string Adres { get; set; }
    public string NIP { get; set; }

    [JsonIgnore]
    public ICollection<Dokument> Dokumenty { get; set; } = new List<Dokument>();
}

public class Produkt
{
    public int Id { get; set; }
    public string Nazwa { get; set; }
}

