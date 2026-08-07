CREATE TABLE Visits (
    VisitID INT IDENTITY(1,1) PRIMARY KEY,
    PatientIdentifier NVARCHAR(50) NOT NULL,
    Department NVARCHAR(100) NOT NULL,
    ProviderName NVARCHAR(100) NOT NULL,
    VisitDate DATE NOT NULL,
    ArrivalTime TIME NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    Notes NVARCHAR(500)
);
