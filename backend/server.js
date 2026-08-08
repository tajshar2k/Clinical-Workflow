// Load environment variables
require("dotenv").config();

// Load packages
const express = require("express");
const sql = require("mssql");
const cors = require("cors");

// Create Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Azure SQL configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

// Validate required visit fields
function validateVisit(data) {
  const requiredFields = [
    "PatientIdentifier",
    "Department",
    "ProviderName",
    "VisitDate",
    "ArrivalTime",
    "Status"
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      return `${field} is required`;
    }
  }

  return null;
}

// Basic API test
app.get("/", (req, res) => {
  res.json({
    message: "ClinicFlow API is running"
  });
});

// Test database connection
app.get("/api/test-db", async (req, res) => {
  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      SELECT TOP 1 * FROM Visits
    `;

    res.json(result.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Database connection failed"
    });
  }
});

// Get all visits
app.get("/api/visits", async (req, res) => {
  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      SELECT * FROM Visits
      ORDER BY VisitID
    `;

    res.json(result.recordset);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve visits"
    });
  }
});

// Get one visit by ID
app.get("/api/visits/:id", async (req, res) => {
  try {
    await sql.connect(dbConfig);

    const request = new sql.Request();

    request.input("VisitID", sql.Int, req.params.id);

    const result = await request.query(`
      SELECT * FROM Visits
      WHERE VisitID = @VisitID
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: "Visit not found"
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve visit"
    });
  }
});

// Create a new visit
app.post("/api/visits", async (req, res) => {
  try {
    const validationError = validateVisit(req.body);

    if (validationError) {
      return res.status(400).json({
        error: validationError
      });
    }

    await sql.connect(dbConfig);

    const {
      PatientIdentifier,
      Department,
      ProviderName,
      VisitDate,
      ArrivalTime,
      Status,
      Notes
    } = req.body;

    const request = new sql.Request();

    request.input(
      "PatientIdentifier",
      sql.NVarChar(50),
      PatientIdentifier
    );

    request.input(
      "Department",
      sql.NVarChar(100),
      Department
    );

    request.input(
      "ProviderName",
      sql.NVarChar(100),
      ProviderName
    );

    request.input(
      "VisitDate",
      sql.NVarChar(20),
      VisitDate
    );

    request.input(
      "ArrivalTime",
      sql.NVarChar(20),
      ArrivalTime
    );

    request.input(
      "Status",
      sql.NVarChar(50),
      Status
    );

    request.input(
      "Notes",
      sql.NVarChar(500),
      Notes || null
    );

    const result = await request.query(`
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
      OUTPUT INSERTED.*
      VALUES
      (
        @PatientIdentifier,
        @Department,
        @ProviderName,
        CONVERT(date, @VisitDate),
        CONVERT(time, @ArrivalTime),
        @Status,
        @Notes
      )
    `);

    res.status(201).json(result.recordset[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create visit"
    });
  }
});

// Update an existing visit
app.put("/api/visits/:id", async (req, res) => {
  try {
    const validationError = validateVisit(req.body);

    if (validationError) {
      return res.status(400).json({
        error: validationError
      });
    }

    await sql.connect(dbConfig);

    const {
      PatientIdentifier,
      Department,
      ProviderName,
      VisitDate,
      ArrivalTime,
      Status,
      Notes
    } = req.body;

    const request = new sql.Request();

    request.input("VisitID", sql.Int, req.params.id);

    request.input(
      "PatientIdentifier",
      sql.NVarChar(50),
      PatientIdentifier
    );

    request.input(
      "Department",
      sql.NVarChar(100),
      Department
    );

    request.input(
      "ProviderName",
      sql.NVarChar(100),
      ProviderName
    );

    request.input(
      "VisitDate",
      sql.NVarChar(20),
      VisitDate
    );

    request.input(
      "ArrivalTime",
      sql.NVarChar(20),
      ArrivalTime
    );

    request.input(
      "Status",
      sql.NVarChar(50),
      Status
    );

    request.input(
      "Notes",
      sql.NVarChar(500),
      Notes || null
    );

    const result = await request.query(`
      UPDATE Visits
      SET
        PatientIdentifier = @PatientIdentifier,
        Department = @Department,
        ProviderName = @ProviderName,
        VisitDate = CONVERT(date, @VisitDate),
        ArrivalTime = CONVERT(time, @ArrivalTime),
        Status = @Status,
        Notes = @Notes
      OUTPUT INSERTED.*
      WHERE VisitID = @VisitID
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: "Visit not found"
      });
    }

    res.json(result.recordset[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update visit"
    });
  }
});

// Delete a visit by ID
app.delete("/api/visits/:id", async (req, res) => {
  try {
    await sql.connect(dbConfig);

    const request = new sql.Request();

    request.input("VisitID", sql.Int, req.params.id);

    const result = await request.query(`
      DELETE FROM Visits
      OUTPUT DELETED.*
      WHERE VisitID = @VisitID
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: "Visit not found"
      });
    }

    res.json({
      message: "Visit deleted successfully",
      deletedVisit: result.recordset[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete visit"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`ClinicFlow API running on port ${PORT}`);
});