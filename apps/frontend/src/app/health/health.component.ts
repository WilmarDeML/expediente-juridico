import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-health',
  standalone: true,
  template: `<span>ok</span>`,
})
export class HealthComponent implements OnInit {
  private readonly http = inject(HttpClient);

  ngOnInit() {
    // Ping al backend para mantenerlo activo
    this.http
      .get(`${environment.apiUrl.replace('/api', '')}/api/health`)
      .subscribe();
  }
}
