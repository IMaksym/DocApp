using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class CreateDokumentDto
{
    [Required]
    public string TypDokumentu { get; set; }

    public KontrahentDto Kontrahent { get; set; }

    [Required]
    public List<ElementyDokumentowDto> ElementyDokumentow { get; set; }

    public int? DokumentPowiazanyId { get; set; }
}

public class ElementyDokumentowDto
{
    [Required]
    public int ProduktId { get; set; }

    [Required]
    public int Ilosc { get; set; }
}

public class KontrahentDto
{
    [Required]
    public string Nazwa { get; set; }

    public string Adres { get; set; }

    public string Telefon { get; set; }
}
