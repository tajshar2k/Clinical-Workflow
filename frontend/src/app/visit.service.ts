import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visit } from './visit';

@Injectable({
  providedIn: 'root'
})
export class VisitService {

  private apiUrl =
    'https://clinicflow-api-dtd5hkcqc7hzg0dg.centralus-01.azurewebsites.net/api/visits';

  constructor(private http: HttpClient) {}

  getVisits(): Observable<Visit[]> {
    return this.http.get<Visit[]>(this.apiUrl);
  }

  getVisit(id: number): Observable<Visit> {
    return this.http.get<Visit>(`${this.apiUrl}/${id}`);
  }

  createVisit(visit: Visit): Observable<Visit> {
    return this.http.post<Visit>(this.apiUrl, visit);
  }

  updateVisit(id: number, visit: Visit): Observable<Visit> {
    return this.http.put<Visit>(`${this.apiUrl}/${id}`, visit);
  }

  deleteVisit(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${id}`
    );
  }
}