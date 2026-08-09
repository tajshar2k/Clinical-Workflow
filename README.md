
# ClinicFlow

ClinicFlow is a web application I created for my ITMD 504 final project. The purpose of the application is to keep track of fictional clinic visits and allow the user to add, edit, view, and delete visit records.

The project uses Angular for the frontend, Node.js and Express for the backend, and Azure SQL for the database.

## Live Application

Frontend:

https://clinicflow-web-e7fee4fmb5gvawa9.centralus-01.azurewebsites.net

Backend API:

https://clinicflow-api-dtd5hkcqc7hzg0dg.centralus-01.azurewebsites.net/api/visits

## What the Application Does

ClinicFlow displays clinic visit information in a dashboard.

Each visit includes:

- Patient identifier
- Department
- Provider
- Visit date
- Arrival time
- Status
- Notes

The application supports the four main CRUD operations:

- Create a new visit
- Read existing visits
- Update a visit
- Delete a visit

All of the patient and visit information in this project is fictional and is only being used to demonstrate the application.

## Application Structure

The application uses three main parts:

```text
Angular Frontend
       |
       | HTTP requests / JSON
       v
Node.js + Express API
       |
       | SQL
       v
Azure SQL Database
