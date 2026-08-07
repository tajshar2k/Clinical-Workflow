# ClinicFlow Use Case Scenario

## Scenario: Managing a Patient Visit

A patient arrives at an outpatient clinic for an appointment. The receptionist opens ClinicFlow and creates a new visit record by entering the patient identifier, department, provider, visit date, arrival time, and initial status.

After the visit is created, the record appears on the ClinicFlow dashboard.

When the patient is moved to an examination room, a nurse updates the visit status from `Waiting` to `Roomed`.

When the physician begins the appointment, the nurse or physician updates the status to `With Provider`.

After the appointment is finished, the visit status is updated to `Completed`.

If the receptionist notices that a visit was entered incorrectly or duplicated, the record can be edited or deleted.

ClinicFlow stores these changes in the database so that the current visit information remains available to clinic staff.
