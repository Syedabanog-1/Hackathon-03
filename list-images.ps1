$env:DOCKER_HOST = 'tcp://127.0.0.1:63473'
$env:DOCKER_TLS_VERIFY = '1'
$env:DOCKER_CERT_PATH = 'C:\Users\ThinK Pad\.minikube\certs'
docker images --format "{{.Repository}}:{{.Tag}}" | Where-Object { $_ -notmatch "^k8s|^registry|^pause|^<none>" }
