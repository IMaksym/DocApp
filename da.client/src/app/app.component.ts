import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Dokument {
  id: number;
  typ: string;
  data: string;
}

interface Element {
  id: number;
  dokumentId: number;
  nazwaProduktu: string;
  ilosc: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentTab = 'list';
  dokumenty: Dokument[] = [];
  selectedDokumentId: number | null = null;
  selectedDokument: Dokument | null = null;
  dokumentElements: Element[] = [];
  newDokument: Dokument = { id: 0, typ: '', data: new Date().toISOString().slice(0, 10) };

  private apiUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getDokumenty();
  }

  setTab(tab: string): void {
    this.currentTab = tab;
  }

  getDokumenty(): void {
    this.http.get<Dokument[]>(`${this.apiUrl}/dokumenty`)
      .subscribe(data => {
        this.dokumenty = data.map(dokument => ({
          ...dokument,
          data: this.formatDateWithoutTime(dokument.data)
        }));
      }, error => {
        console.error('Error fetching dokumenty:', error);
      });
  }

  selectDokument(dokument: Dokument): void {
    this.selectedDokumentId = dokument.id;
  }

  viewDokument(dokument: Dokument, event: Event): void {
    event.stopPropagation();
    this.selectedDokument = dokument;
    this.getDokumentElements(dokument.id);  // Fetch elements for the selected document
    this.setTab('view');
  }

  getDokumentElements(dokumentId: number): void {
    this.http.get<Element[]>(`${this.apiUrl}/dokumenty/${dokumentId}/elements`)
      .subscribe(data => {
        this.dokumentElements = data;
      }, error => {
        console.error('Error fetching dokument elements:', error);
      });
  }

  zapiszDokument() {
    const nowyDokument = {
      typ: this.newDokument.typ,
      data: this.formatDateWithoutTime(this.newDokument.data)
    };

    this.http.post<Dokument>(`${this.apiUrl}/dokumenty`, nowyDokument)
      .subscribe({
        next: response => {
          console.log('Dokument saved successfully', response);
          this.getDokumenty();
          this.setTab('list');
        },
        error: error => {
          console.error('Error saving dokument:', error);
          if (error.error) {
            console.error('Server-side error message:', error.error);
          }
        }
      });
  }

  formatDateWithoutTime(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
