$ErrorActionPreference = 'Stop'
Invoke-RestMethod -Method Get -Uri 'http://localhost:3001/api/weight-measurements'
