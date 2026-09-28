$ErrorActionPreference = 'Stop'
$body = Get-Content "$PSScriptRoot/sample-data.json" -Raw
Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/api/rabbits' -ContentType 'application/json' -Body $body
