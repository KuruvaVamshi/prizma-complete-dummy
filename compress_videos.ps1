$ErrorActionPreference = "Stop"

$ffmpegUrl = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"
$ffmpegZip = "ffmpeg.zip"
$ffmpegDir = "ffmpeg-folder"

if (!(Test-Path "$ffmpegDir\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe")) {
    Write-Host "Downloading FFmpeg..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $ffmpegUrl -OutFile $ffmpegZip
    Write-Host "Extracting FFmpeg..."
    Expand-Archive -Path $ffmpegZip -DestinationPath $ffmpegDir -Force
}

$ffmpegExe = "$PWD\$ffmpegDir\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe"
$ffprobeExe = "$PWD\$ffmpegDir\ffmpeg-master-latest-win64-gpl\bin\ffprobe.exe"

$videosDir = "Portfolio-page\Videos"
$videos = Get-ChildItem -Path $videosDir -Filter *.mp4 | Where-Object { $_.Length -gt 25MB }

foreach ($video in $videos) {
    Write-Host "Processing $($video.Name)..."
    
    # Get duration
    $formatInfo = & $ffprobeExe -v quiet -print_format json -show_format $video.FullName | ConvertFrom-Json
    $duration = [double]$formatInfo.format.duration
    
    if ($duration -gt 0) {
        $targetTotalBitrate = (($video.Length / 2) * 8) / $duration
        $targetVideoBitrate = $targetTotalBitrate - 128000
        
        if ($targetVideoBitrate -le 0) {
            $targetVideoBitrate = $targetTotalBitrate / 2 # fallback
        }
        
        $targetVideoBitrateKbps = [math]::Round($targetVideoBitrate / 1000)
        
        $tempFile = "$($video.DirectoryName)\temp_$($video.Name)"
        
        Write-Host "Compressing $($video.Name) to half size (target bitrate ${targetVideoBitrateKbps}k)..."
        
        # Run ffmpeg to compress (Single pass, fast preset)
        $ffmpegArgs = @("-y", "-i", $video.FullName, "-c:v", "libx264", "-preset", "fast", "-b:v", "${targetVideoBitrateKbps}k", "-c:a", "aac", "-b:a", "128k", $tempFile)
        & $ffmpegExe $ffmpegArgs
        
        if ($LASTEXITCODE -eq 0 -and (Test-Path $tempFile)) {
            Move-Item -Path $tempFile -Destination $video.FullName -Force
            Write-Host "Successfully compressed $($video.Name)."
        } else {
            Write-Host "Failed to compress $($video.Name)."
        }
    } else {
        Write-Host "Could not determine duration for $($video.Name)."
    }
}
Write-Host "All done."
