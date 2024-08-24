using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace DA.Models
{
    public class Dokument
    {
        public Dokument()
        {
            ElementyDokumentow = new List<ElementyDokumentow>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        public string TypDokumentu { get; set; }

        public int? KontrahentId { get; set; }

        [ForeignKey(nameof(KontrahentId))]
        public virtual Kontrahent Kontrahent { get; set; }

        [JsonIgnore]
        public virtual ICollection<ElementyDokumentow> ElementyDokumentow { get; set; }
    }

    public class ElementyDokumentow
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int DokumentId { get; set; }

        [ForeignKey(nameof(DokumentId))]
        public virtual Dokument Dokument { get; set; }

        [Required]
        public int ProduktId { get; set; }

        [ForeignKey(nameof(ProduktId))]
        public virtual Produkt Produkt { get; set; }

        [Required]
        public int Ilosc { get; set; }
    }

    public class Kontrahent
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Nazwa { get; set; }

        public string Adres { get; set; }

        public string Telefon { get; set; }
    }

    public class Produkt
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Nazwa { get; set; }

    }

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Dokument> Dokumenty { get; set; }
        public DbSet<ElementyDokumentow> Elementy_dokumentow { get; set; } 
        public DbSet<Kontrahent> Kontrahenci { get; set; }
        public DbSet<Produkt> Produkty { get; set; }
    }
}
