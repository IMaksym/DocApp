import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Dokument {
  id: number;
  typ: string;
  data: string;
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
        this.dokumenty = data;
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
    this.setTab('view');
  }
}
