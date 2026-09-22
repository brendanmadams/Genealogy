<#
  Copies the originals listed in data/media.json into media/ (JPEGs resized to
  at most 1600 px on the long side, PDFs copied as-is) and cuts square
  portraits into images/<person id>.jpg (400 x 400).

    powershell -NoProfile -File scripts/prepare-media.ps1

  Then run: node scripts/build.js
#>
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root   = Split-Path -Parent $PSScriptRoot
$cfg    = Get-Content (Join-Path $root 'data/media.json') -Raw | ConvertFrom-Json
$src    = Resolve-Path (Join-Path $root $cfg.source_dir)
$media  = Join-Path $root 'media'
$images = Join-Path $root 'images'
New-Item -ItemType Directory -Force $media, $images | Out-Null

$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 84L

function Save-Resized($inPath, $outPath, $maxSide, $crop) {
  $img = [System.Drawing.Image]::FromFile($inPath)
  try {
    # honour EXIF orientation
    if ($img.PropertyIdList -contains 0x0112) {
      switch ($img.GetPropertyItem(0x0112).Value[0]) {
        3 { $img.RotateFlip('Rotate180FlipNone') }
        6 { $img.RotateFlip('Rotate90FlipNone') }
        8 { $img.RotateFlip('Rotate270FlipNone') }
      }
    }
    if ($crop) { $sx, $sy, $sw, $sh = $crop[0], $crop[1], $crop[2], $crop[2] }
    else       { $sx, $sy, $sw, $sh = 0, 0, $img.Width, $img.Height }
    $scale = [Math]::Min(1.0, $maxSide / [Math]::Max($sw, $sh))
    if ($crop) { $scale = $maxSide / $sw }   # portraits always come out at maxSide
    $w = [int][Math]::Round($sw * $scale); $h = [int][Math]::Round($sh * $scale)
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $w, $h), (New-Object System.Drawing.Rectangle $sx, $sy, $sw, $sh), 'Pixel')
    $g.Dispose()
    $bmp.Save($outPath, $jpeg, $params)
    $bmp.Dispose()
  } finally { $img.Dispose() }
}

$n = 0
foreach ($it in $cfg.items) {
  $files = if ($it.kind -eq 'album') { $it.pages } else { @($it.file) }
  $i = 0
  foreach ($f in $files) {
    $i++
    $in = Join-Path $src $f
    if (-not (Test-Path $in)) { Write-Warning "missing: $f"; continue }
    $ext = [IO.Path]::GetExtension($f).ToLower()
    $base = if ($it.kind -eq 'album') { '{0}-{1:D2}' -f $it.id, $i } else { $it.id }
    if ($ext -eq '.pdf') { Copy-Item $in (Join-Path $media "$base.pdf") -Force }
    else { Save-Resized $in (Join-Path $media "$base.jpg") 1600 $null }
    $n++
  }
  foreach ($p in @($it.portraits)) {
    if (-not $p) { continue }
    Save-Resized (Join-Path $src $it.file) (Join-Path $images "$($p.person).jpg") 400 $p.crop
    Write-Host "portrait: $($p.person)"
  }
}
Write-Host "media files written: $n"
