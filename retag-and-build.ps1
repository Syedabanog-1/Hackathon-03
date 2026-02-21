$env:DOCKER_HOST = 'tcp://127.0.0.1:63473'
$env:DOCKER_TLS_VERIFY = '1'
$env:DOCKER_CERT_PATH = 'C:\Users\ThinK Pad\.minikube\certs'

Write-Host "=== Current images in Minikube ===" -ForegroundColor Cyan
docker images --format "{{.Repository}}:{{.Tag}}" | Where-Object { $_ -notmatch "^k8s|^registry|^pause|gcr.io|docker.io/library" }

Write-Host ""
Write-Host "=== Re-tagging existing images ===" -ForegroundColor Cyan
$retags = @(
    @{ old = 'learnflow-triage:latest';      new = 'learnflow/triage-service:latest' },
    @{ old = 'learnflow-concepts:latest';    new = 'learnflow/concepts-service:latest' },
    @{ old = 'learnflow-debug:latest';       new = 'learnflow/debug-service:latest' },
    @{ old = 'learnflow-code-review:latest'; new = 'learnflow/code-review-service:latest' },
    @{ old = 'learnflow-progress:latest';    new = 'learnflow/progress-service:latest' }
)
foreach ($r in $retags) {
    $result = docker tag $r.old $r.new 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK  $($r.old) -> $($r.new)"
    } else {
        Write-Host "FAIL $($r.old): $result"
    }
}

Write-Host ""
Write-Host "=== Pulling base images ===" -ForegroundColor Cyan
Write-Host "Pulling python:3.11-slim..."
docker pull python:3.11-slim 2>&1 | Select-Object -Last 2
Write-Host "Pulling node:20-alpine..."
docker pull node:20-alpine 2>&1 | Select-Object -Last 2

Write-Host ""
Write-Host "=== Building failed services ===" -ForegroundColor Cyan
$baseDir = 'D:\syeda Gulzar Bano\Hackathon-03\learnflow-app'
$failed = @(
    @{ name = 'exercise';     dir = 'services\exercise-service';     tag = 'learnflow/exercise-service:latest' },
    @{ name = 'code-sandbox'; dir = 'services\code-sandbox-service'; tag = 'learnflow/code-sandbox-service:latest' },
    @{ name = 'frontend';     dir = 'frontend';                      tag = 'learnflow-frontend:latest' },
    @{ name = 'docs';         dir = 'docs';                          tag = 'learnflow-docs:latest' }
)
foreach ($svc in $failed) {
    $svcDir = Join-Path $baseDir $svc.dir
    Write-Host "Building $($svc.name)..."
    $result = docker build -t $svc.tag $svcDir 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK $($svc.name) built"
    } else {
        Write-Host "FAIL $($svc.name): $($result | Select-Object -Last 3)"
    }
}

Write-Host ""
Write-Host "=== Final image list ===" -ForegroundColor Green
docker images --format "{{.Repository}}:{{.Tag}}" | Where-Object { $_ -match "learnflow" }
