import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VisitService } from './visit.service';
import { Visit } from './visit';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private visitService = inject(VisitService);
  private changeDetector = inject(ChangeDetectorRef);

  visits: Visit[] = [];

  showAddForm = false;

  selectedVisit: Visit | null = null;

  successMessage = '';
  errorMessage = '';

  newVisit: Visit = {
    VisitID: 0,
    PatientIdentifier: '',
    Department: '',
    ProviderName: '',
    VisitDate: '',
    ArrivalTime: '',
    Status: 'Waiting',
    Notes: ''
  };

  ngOnInit(): void {
    this.loadVisits();
  }

  loadVisits(): void {
    this.visitService.getVisits().subscribe({
      next: (data: Visit[]) => {
        this.visits = data;
        this.changeDetector.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Error loading visits:', error);
        this.errorMessage = 'Unable to load visits.';
        this.changeDetector.detectChanges();
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveVisit(): void {

    if (
      !this.newVisit.PatientIdentifier ||
      !this.newVisit.Department ||
      !this.newVisit.ProviderName ||
      !this.newVisit.VisitDate ||
      !this.newVisit.ArrivalTime ||
      !this.newVisit.Status
    ) {
      this.errorMessage = 'Please complete all required fields.';
      this.successMessage = '';
      return;
    }

    this.visitService.createVisit(this.newVisit).subscribe({
      next: () => {

        this.successMessage = 'Visit added successfully.';
        this.errorMessage = '';

        this.loadVisits();

        this.newVisit = {
          VisitID: 0,
          PatientIdentifier: '',
          Department: '',
          ProviderName: '',
          VisitDate: '',
          ArrivalTime: '',
          Status: 'Waiting',
          Notes: ''
        };

        this.showAddForm = false;
        this.changeDetector.detectChanges();
      },

      error: (error: unknown) => {
        console.error('Error creating visit:', error);
        this.errorMessage = 'Unable to add visit.';
        this.successMessage = '';
        this.changeDetector.detectChanges();
      }
    });
  }

  editVisit(visit: Visit): void {

    this.errorMessage = '';
    this.successMessage = '';

    this.selectedVisit = {
      ...visit,

      VisitDate: visit.VisitDate
        ? String(visit.VisitDate).substring(0, 10)
        : '',

      ArrivalTime: visit.ArrivalTime
        ? String(visit.ArrivalTime).substring(11, 16)
        : ''
    };

    this.changeDetector.detectChanges();
  }

  cancelEdit(): void {
    this.selectedVisit = null;
    this.changeDetector.detectChanges();
  }

  updateSelectedVisit(): void {

    if (
      !this.selectedVisit ||
      this.selectedVisit.VisitID === undefined
    ) {
      return;
    }

    if (
      !this.selectedVisit.PatientIdentifier ||
      !this.selectedVisit.Department ||
      !this.selectedVisit.ProviderName ||
      !this.selectedVisit.VisitDate ||
      !this.selectedVisit.ArrivalTime ||
      !this.selectedVisit.Status
    ) {
      this.errorMessage = 'Please complete all required fields.';
      this.successMessage = '';
      return;
    }

    this.visitService
      .updateVisit(
        this.selectedVisit.VisitID,
        this.selectedVisit
      )
      .subscribe({
        next: () => {

          this.successMessage = 'Visit updated successfully.';
          this.errorMessage = '';

          this.selectedVisit = null;

          this.loadVisits();

          this.changeDetector.detectChanges();
        },

        error: (error: unknown) => {
          console.error('Error updating visit:', error);
          this.errorMessage = 'Unable to update visit.';
          this.successMessage = '';
          this.changeDetector.detectChanges();
        }
      });
  }

  deleteVisit(visit: Visit): void {

    if (visit.VisitID === undefined) {
      return;
    }

    const confirmed = window.confirm(
      `Delete visit for ${visit.PatientIdentifier}?`
    );

    if (!confirmed) {
      return;
    }

    this.visitService.deleteVisit(visit.VisitID).subscribe({
      next: () => {

        this.successMessage = 'Visit deleted successfully.';
        this.errorMessage = '';

        this.loadVisits();

        this.changeDetector.detectChanges();
      },

      error: (error: unknown) => {
        console.error('Error deleting visit:', error);
        this.errorMessage = 'Unable to delete visit.';
        this.successMessage = '';
        this.changeDetector.detectChanges();
      }
    });
  }
}