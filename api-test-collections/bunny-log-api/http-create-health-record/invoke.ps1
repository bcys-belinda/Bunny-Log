$ErrorActionPreference = 'Stop'
$body = Get-Content "$PSScriptRoot/sample-data.json" -Raw
Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/api/health-records' -ContentType 'application/json' -Body $body
