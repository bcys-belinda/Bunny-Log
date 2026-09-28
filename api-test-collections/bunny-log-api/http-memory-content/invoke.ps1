$ErrorActionPreference = 'Stop'
$id = if ($env:BUNNY_MEMORY_ID) { $env:BUNNY_MEMORY_ID } else { '<memory-id>' }
Invoke-WebRequest -Method Get -Uri "http://localhost:3001/api/memories/$id/content"
