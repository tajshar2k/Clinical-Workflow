export interface Visit {
  VisitID?: number;
  PatientIdentifier: string;
  Department: string;
  ProviderName: string;
  VisitDate: string;
  ArrivalTime: string;
  Status: string;
  Notes?: string;
}