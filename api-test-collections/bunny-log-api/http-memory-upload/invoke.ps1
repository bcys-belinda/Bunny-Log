$ErrorActionPreference = 'Stop'
if (-not $env:BUNNY_RABBIT_ID) { throw 'Set BUNNY_RABBIT_ID before running this upload test.' }
if (-not $env:BUNNY_PHOTO_PATH) { throw 'Set BUNNY_PHOTO_PATH to an image file before running this upload test.' }
$form = @{ rabbitId = $env:BUNNY_RABBIT_ID; caption = 'Smoke test memory'; photo = Get-Item $env:BUNNY_PHOTO_PATH }
Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/api/memories/upload' -Form $form
