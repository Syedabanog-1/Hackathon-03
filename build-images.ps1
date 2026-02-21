# Build all LearnFlow service images into Minikube's Docker daemon
$env:DOCKER_HOST = 'tcp://127.0.0.1:63473'
$env:DOCKER_TLS_VERIFY = '1'
$env:DOCKER_CERT_PATH = 'C:\Users\ThinK Pad\.minikube\certs'

$baseDir = 'D:\syeda Gulzar Bano\Hackathon-03\learnflow-app'

$services = @(
    @{ name = 'triage';       dir = 'services\triage-service';       tag = 'learnflow/triage-service:latest' },
    @{ name = 'concepts';     dir = 'services\concepts-service';     tag = 'learnflow/concepts-service:latest' },
    @{ name = 'debug';        dir = 'services\debug-service';        tag = 'learnflow/debug-service:latest' },
    @{ name = 'code-review';  dir = 'services\code-review-service';  tag = 'learnflow/code-review-service:latest' },
    @{ name = 'exercise';     dir = 'services\exercise-service';     tag = 'learnflow/exercise-service:latest' },
    @{ name = 'progress';     dir = 'services\progress-service';     tag = 'learnflow/progress-service:latest' },
    @{ name = 'code-sandbox'; dir = 'services\code-sandbox-service'; tag = 'learnflow/code-sandbox-service:latest' }
)

foreach ($svc in $services) {
    $svcDir = Join-Path $baseDir $svc.dir
    Write-Host "Building $($svc.name) from $svcDir ..."
    $result = docker build -t $svc.tag $svcDir 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK $($svc.name) built"
    } else {
        Write-Host "FAIL $($svc.name): $($result | Select-Object -Last 3)"
    }
}

# Build frontend
Write-Host "Building frontend..."
$frontendDir = Join-Path $baseDir 'frontend'
docker build -t 'learnflow-frontend:latest' $frontendDir 2>&1 | Select-Object -Last 3
if ($LASTEXITCODE -eq 0) { Write-Host "OK frontend built" } else { Write-Host "FAIL frontend" }

# Build docs
Write-Host "Building docs..."
$docsDir = Join-Path $baseDir 'docs'
docker build -t 'learnflow-docs:latest' $docsDir 2>&1 | Select-Object -Last 3
if ($LASTEXITCODE -eq 0) { Write-Host "OK docs built" } else { Write-Host "FAIL docs" }

Write-Host "All builds complete."
