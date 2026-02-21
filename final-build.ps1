$env:DOCKER_HOST = 'tcp://127.0.0.1:63473'
$env:DOCKER_TLS_VERIFY = '1'
$env:DOCKER_CERT_PATH = 'C:\Users\ThinK Pad\.minikube\certs'

$baseDir = 'D:\syeda Gulzar Bano\Hackathon-03\learnflow-app'

Write-Host "=== Pulling nginx:alpine ===" -ForegroundColor Cyan
docker pull nginx:alpine 2>&1 | Select-Object -Last 2

Write-Host ""
Write-Host "=== Building remaining services ===" -ForegroundColor Cyan
$services = @(
    @{ name = 'code-sandbox'; dir = 'services\code-sandbox-service'; tag = 'learnflow/code-sandbox-service:latest' },
    @{ name = 'frontend';     dir = 'frontend';                      tag = 'learnflow-frontend:latest' },
    @{ name = 'docs';         dir = 'docs';                          tag = 'learnflow-docs:latest' }
)
foreach ($svc in $services) {
    $svcDir = Join-Path $baseDir $svc.dir
    Write-Host "Building $($svc.name)..."
    $result = docker build -t $svc.tag $svcDir 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK $($svc.name) built" -ForegroundColor Green
    } else {
        Write-Host "FAIL $($svc.name):" -ForegroundColor Red
        $result | Select-Object -Last 5 | ForEach-Object { Write-Host "  $_" }
    }
}

Write-Host ""
Write-Host "=== All LearnFlow images ===" -ForegroundColor Green
docker images --format "{{.Repository}}:{{.Tag}}" | Where-Object { $_ -match "learnflow" } | Sort-Object
