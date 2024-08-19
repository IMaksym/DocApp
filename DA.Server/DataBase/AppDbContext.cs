﻿using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

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

}
public class Element
{
    public int Id { get; set; }
    public int DokumentId { get; set; }
    public string NazwaProduktu { get; set; }
    public int Ilosc { get; set; }
    public Dokument Dokument { get; set; }
    //public Produkt Produkt { get; set; }
}

public class Kontrahent
{
    public int Id { get; set; }
    public string Nazwa { get; set; }
}

public class Produkt
{
    public int Id { get; set; }
    public string Nazwa { get; set; }
    public int Cena { get; set; }

}
