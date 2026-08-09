const express = require('express');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'https://clinicflow-web-e7fee4fmb5gvawa9.centralus-01.azurewebsites.net',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

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

// Convert HTML time value such as "09:30" into a JavaScript Date
// that the mssql driver can use with sql.Time.
function convertTimeToDate(timeValue) {
  if (!timeValue) {
    return null;
  }

  const [hours, minutes, seconds = '00'] = timeValue.split(':');

  const time = new Date(1970, 0, 1);
  time.setHours(
    Number(hours),
    Number(minutes),
    Number(seconds),
    0
  );

  return time;
}

// GET all visits
app.get('/api/visits', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request().query(`
      SELECT *
      FROM Visits
      ORDER BY VisitID
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error retrieving visits:', error);

    res.status(500).json({
      message: 'Error retrieving visits'
    });
  }
});

// GET one visit
app.get('/api/visits/:id', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input('VisitID', sql.Int, req.params.id)
      .query(`
        SELECT *
        FROM Visits
        WHERE VisitID = @VisitID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: 'Visit not found'
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error retrieving visit:', error);

    res.status(500).json({
      message: 'Error retrieving visit'
    });
  }
});

// CREATE visit
app.post('/api/visits', async (req, res) => {
  try {
    const {
      PatientIdentifier,
      Department,
      ProviderName,
      VisitDate,
      ArrivalTime,
      Status,
      Notes
    } = req.body;

    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input(
        'PatientIdentifier',
        sql.NVarChar(50),
        PatientIdentifier
      )
      .input(
        'Department',
        sql.NVarChar(100),
        Department
      )
      .input(
        'ProviderName',
        sql.NVarChar(100),
        ProviderName
      )
      .input(
        'VisitDate',
        sql.Date,
        VisitDate
      )
      .input(
        'ArrivalTime',
        sql.Time,
        convertTimeToDate(ArrivalTime)
      )
      .input(
        'Status',
        sql.NVarChar(50),
        Status
      )
      .input(
        'Notes',
        sql.NVarChar(500),
        Notes || null
      )
      .query(`
        INSERT INTO Visits (
          PatientIdentifier,
          Department,
          ProviderName,
          VisitDate,
          ArrivalTime,
          Status,
          Notes
        )
        OUTPUT INSERTED.*
        VALUES (
          @PatientIdentifier,
          @Department,
          @ProviderName,
          @VisitDate,
          @ArrivalTime,
          @Status,
          @Notes
        )
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error creating visit:', error);

    res.status(500).json({
      message: 'Error creating visit'
    });
  }
});

// UPDATE visit
app.put('/api/visits/:id', async (req, res) => {
  try {
    const {
      PatientIdentifier,
      Department,
      ProviderName,
      VisitDate,
      ArrivalTime,
      Status,
      Notes
    } = req.body;

    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input(
        'VisitID',
        sql.Int,
        req.params.id
      )
      .input(
        'PatientIdentifier',
        sql.NVarChar(50),
        PatientIdentifier
      )
      .input(
        'Department',
        sql.NVarChar(100),
        Department
      )
      .input(
        'ProviderName',
        sql.NVarChar(100),
        ProviderName
      )
      .input(
        'VisitDate',
        sql.Date,
        VisitDate
      )
      .input(
        'ArrivalTime',
        sql.Time,
        convertTimeToDate(ArrivalTime)
      )
      .input(
        'Status',
        sql.NVarChar(50),
        Status
      )
      .input(
        'Notes',
        sql.NVarChar(500),
        Notes || null
      )
      .query(`
        UPDATE Visits
        SET
          PatientIdentifier = @PatientIdentifier,
          Department = @Department,
          ProviderName = @ProviderName,
          VisitDate = @VisitDate,
          ArrivalTime = @ArrivalTime,
          Status = @Status,
          Notes = @Notes
        OUTPUT INSERTED.*
        WHERE VisitID = @VisitID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: 'Visit not found'
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error updating visit:', error);

    res.status(500).json({
      message: 'Error updating visit'
    });
  }
});

// DELETE visit
app.delete('/api/visits/:id', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input(
        'VisitID',
        sql.Int,
        req.params.id
      )
      .query(`
        DELETE FROM Visits
        OUTPUT DELETED.*
        WHERE VisitID = @VisitID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: 'Visit not found'
      });
    }

    res.json({
      message: 'Visit deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting visit:', error);

    res.status(500).json({
      message: 'Error deleting visit'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ClinicFlow API running on port ${PORT}`);
});