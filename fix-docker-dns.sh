#!/bin/bash
# Fix Docker daemon DNS inside Minikube
cat > /tmp/daemon.json << 'EODAEMON'
{
  "exec-opts": ["native.cgroupdriver=cgroupfs"],
  "log-driver": "json-file",
  "log-opts": {"max-size": "100m"},
  "storage-driver": "overlay2",
  "dns": ["8.8.8.8", "8.8.4.4"]
}
EODAEMON
sudo cp /tmp/daemon.json /etc/docker/daemon.json
echo "Restarting Docker daemon..."
sudo service docker restart
sleep 3
sudo service docker status | head -5
echo "DNS fix applied"
