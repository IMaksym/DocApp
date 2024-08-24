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
      }, error => {
        console.error('Błąd podczas pobierania dokumentów', error);
      });
  }

  loadProdukty() {
    this.http.get<Produkt[]>('https://localhost:5001/api/dokumenty/produkty')
      .subscribe(produkty => {
        this.produkty = produkty;
      }, error => {
        console.error('Błąd podczas pobierania produktów', error);
      });
  }

  viewDocument(dokument: any) {
    this.selectedDokument = dokument;
    this.selectTab('preview'); // Переключаем вкладку на "Podgląd"
  }

  createDokument() {
    if (this.newDokument.typDokumentu.trim() === '') {
      console.error('TypDokumentu is required');
      return;
    }

    if (this.selectedProduktId !== null) {
      this.newDokument.elementyDokumentow.push({
        produktId: Number(this.selectedProduktId),
        ilosc: this.ilosc
      });
    }

    // Ensure that elementyDokumentow is not empty
    if (this.newDokument.elementyDokumentow.length === 0) {
      console.error('ElementyDokumentow is required');
      return;
    }

    console.log('Sending data:', this.newDokument);

    this.http.post('https://localhost:5001/api/dokumenty/dokument', this.newDokument)
      .subscribe(response => {
        console.log('Dokument created', response);
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
      }, error => {
        console.error('Error creating document', error);
      });
  }

  addElement() {
    if (this.selectedProduktId !== null && this.ilosc > 0) {
      this.newDokument.elementyDokumentow.push({
        produktId: Number(this.selectedProduktId),
        ilosc: this.ilosc
      });
      this.selectedProduktId = null; // сброс значения
      this.ilosc = 1; // сброс значения
    } else {
      console.error('Wybierz produkt i ustaw ilość');
    }
  }

  selectTab(tab: string) {
    this.currentTab = tab;
  }
}
