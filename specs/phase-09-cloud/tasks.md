# Tasks: Phase 09 — Cloud Deployment

**Input**: specs/phase-09-cloud/spec.md + plan.md
**Prerequisites**: Phase 08 complete; cloud account provisioned; kubectl cloud context configured

## Phase 1: Cloud Cluster Setup

- [ ] T001 Provision cloud K8s cluster (choose one):
  - Azure: `az aks create --name learnflow --node-count 2 --node-vm-size Standard_D4s_v3`
  - GKE: `gcloud container clusters create learnflow --num-nodes=2 --machine-type=n2-standard-4`
  - Oracle: `oci ce cluster create --name learnflow`
- [ ] T002 Configure kubectl context: `kubectl config use-context <cloud-cluster>`
- [ ] T003 Verify cluster: "Check Kubernetes cluster health" via k8s-foundation skill

---

## Phase 2: Neon PostgreSQL Setup

- [ ] T004 Create Neon project at neon.tech; obtain DATABASE_URL
- [ ] T005 Store Neon URL as K8s Secret:
  `kubectl create secret generic neon-db --from-literal=DATABASE_URL="<neon-url>" -n learnflow`
- [ ] T006 Prompt: "Deploy PostgreSQL schema to Neon using postgres-k8s-setup skill
  with NEON_MODE=true" — skill reads DATABASE_URL from K8s secret

---

## Phase 3: Deploy All Services (Cloud Context)

- [ ] T007 Run Phase 07 skill prompt sequence against cloud cluster context
  (same prompts, different kubeconfig context — skills unchanged)
- [ ] T008 Install cert-manager for TLS:
  `helm upgrade --install cert-manager jetstack/cert-manager -n cert-manager --set installCRDs=true`
- [ ] T009 Configure ingress with TLS; get public HTTPS URL

---

## Phase 4: Verify

- [ ] T010 Access public HTTPS URL; verify LearnFlow loads
- [ ] T011 Run demo scenario against cloud deployment
- [ ] T012 [P] Verify all quality gates pass on cloud cluster
- [ ] T013 Commit: "Claude: LearnFlow deployed to cloud via skills"
