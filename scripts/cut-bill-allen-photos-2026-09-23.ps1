<#
  Crops the photos listed in scripts/photos-2026-09-23-bill-allen.json from
  the page scans of Bill Allen's document (pNNN.jpg, extracted from
  AdamsFamilyDoc_searchable.pdf) into the media source folder, at full
  resolution, as <file>_AdamsFamilyDoc_pNNN.jpg.

    powershell -NoProfile -File scripts/cut-bill-allen-photos-2026-09-23.ps1 -Pages <folder of pNNN.jpg>
#>
param([Parameter(Mandatory)][string]$Pages)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$spec = Get-Content (Join-Path $PSScriptRoot 'photos-2026-09-23-bill-allen.json') -Raw | ConvertFrom-Json
$cfg  = Get-Content (Join-Path $root 'data/media.json') -Raw | ConvertFrom-Json
$out  = Resolve-Path (Join-Path $root $cfg.source_dir)
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 92L
foreach ($ph in $spec.photos) {
  $page = [System.Drawing.Image]::FromFile((Join-Path $Pages ('p{0:D3}.jpg' -f $ph.page)))
  try {
    $s = $page.Height / 2000.0
    $x = [int]($ph.box[0] * $s); $y = [int]($ph.box[1] * $s)
    $w = [Math]::Min([int](($ph.box[2] - $ph.box[0]) * $s), $page.Width - $x)
    $h = [Math]::Min([int](($ph.box[3] - $ph.box[1]) * $s), $page.Height - $y)
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($page, (New-Object System.Drawing.Rectangle 0, 0, $w, $h), (New-Object System.Drawing.Rectangle $x, $y, $w, $h), 'Pixel')
    $g.Dispose()
    $name = '{0}_AdamsFamilyDoc_p{1:D3}.jpg' -f $ph.file, $ph.page
    $bmp.Save((Join-Path $out $name), $jpeg, $params); $bmp.Dispose()
    Write-Host "$name  ${w}x${h}"
  } finally { $page.Dispose() }
}
