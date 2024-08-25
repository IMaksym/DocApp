import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Kontrahent {
  nazwa: string;
  adres: string;
  telefon: string;
}

interface Produkt {
  id: number;
  nazwa: string;
  cena: number;
}

interface ElementyDokumentow {
  produktId: number;
  ilosc: number;
}

interface DokumentCreateModel {
  typDokumentu: string;
  kontrahent: Kontrahent;
  elementyDokumentow: ElementyDokumentow[];
  dokumentPowiazanyId?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentTab = 'list';
  dokumenty: any[] = [];
  kontrahenci: Kontrahent[] = [];
  produkty: Produkt[] = [];
  elementy: ElementyDokumentow[] = [];
  newDokument: DokumentCreateModel = {
    typDokumentu: '',
    kontrahent: {
      nazwa: '',
      adres: '',
      telefon: ''
    },
    elementyDokumentow: []
  };
  selectedProduktId: number | null = null;
  ilosc: number = 1;
  selectedDokument: any = null;
  linkedDokumentId?: number;
  showLinkedDocumentField: boolean = false;

  filteredDokumenty: any[] = [];

  typyDokumentow: string[] = [
    'Zakupu: Faktura zaliczkowa',
    'Zakupu: Paragon',
    'Zakupu: Faktura zakupu',
    'Sprzedaży: Faktura zaliczkowa',
    'Sprzedaży: Faktura sprzedaży z paragonu',
    'Sprzedaży: Faktura sprzedaży'
  ];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadDokumenty();
    this.loadProdukty();
  }

  loadDokumenty() {
    this.http.get<any[]>('https://localhost:5001/api/dokumenty/dokumenty')
      .subscribe(dokumenty => {
        this.dokumenty = dokumenty;
      });
  }

  loadProdukty() {
    this.http.get<Produkt[]>('https://localhost:5001/api/dokumenty/produkty')
      .subscribe(produkty => {
        this.produkty = produkty;
      });
  }

  filterDokumenty() {
    this.filteredDokumenty = this.dokumenty.filter(dokument =>
      dokument.typDokumentu === 'Zakupu: Paragon' && !this.isDokumentLinked(dokument.id)
    );
  }

  isDokumentLinked(dokumentId: number): boolean {
    return this.dokumenty.some(d => d.dokumentPowiazanyId === dokumentId);
  }

  onTypDokumentuChange(event: any) {
    const typDokumentu = event.target.value;
    this.showLinkedDocumentField = typDokumentu === 'Sprzedaży: Faktura sprzedaży z paragonu';

    if (this.showLinkedDocumentField) {
      this.filterDokumenty();
    }
  }

  viewDocument(dokument: any) {
    this.selectedDokument = dokument;
    this.selectTab('preview');
  }

  createDokument() {
    if (this.newDokument.typDokumentu.trim() === '') return;

    if (this.newDokument.typDokumentu === 'Sprzedaży: Faktura sprzedaży z paragonu') {
      if (!this.linkedDokumentId) return;
      this.newDokument.dokumentPowiazanyId = this.linkedDokumentId;
    }

    if (this.selectedProduktId !== null) {
      this.newDokument.elementyDokumentow.push({
        produktId: Number(this.selectedProduktId),
        ilosc: this.ilosc
      });
    }

    if (this.newDokument.elementyDokumentow.length === 0) return;

    this.http.post('https://localhost:5001/api/dokumenty/dokument', this.newDokument)
      .subscribe(() => {
        this.newDokument = {
          typDokumentu: '',
          kontrahent: {
            nazwa: '',
            adres: '',
            telefon: ''
          },
          elementyDokumentow: []
        };
        this.loadDokumenty();
      });
  }

  addElement() {
    if (this.selectedProduktId !== null && this.ilosc > 0) {
      this.newDokument.elementyDokumentow.push({
        produktId: Number(this.selectedProduktId),
        ilosc: this.ilosc
      });
      this.selectedProduktId = null;
      this.ilosc = 1;
    }
  }

  selectTab(tab: string) {
    this.currentTab = tab;
  }
}
