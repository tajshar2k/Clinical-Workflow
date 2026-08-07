INSERT INTO Visits
(
    PatientIdentifier,
    Department,
    ProviderName,
    VisitDate,
    ArrivalTime,
    Status,
    Notes
)
VALUES
('P-001', 'Family Medicine', 'Dr. Mano', '2026-07-17', '09:00', 'Waiting', 'Routine appointment'),

('P-002', 'Cardiology', 'Dr. Jackson', '2026-07-18', '09:20', 'Roomed', 'Follow-up appointment'),

('P-003', 'Dermatology', 'Dr. Chen', '2026-07-18', '10:00', 'With Provider', 'Skin consultation'),

('P-004', 'Family Medicine', 'Dr. Lee', '2026-07-18', '10:30', 'Completed', 'Annual checkup'),

('P-005', 'Cardiology', 'Dr. Jackson', '2026-08-18', '11:00', 'Cancelled', 'Appointment cancelled');
SELECT *FROM Visits
