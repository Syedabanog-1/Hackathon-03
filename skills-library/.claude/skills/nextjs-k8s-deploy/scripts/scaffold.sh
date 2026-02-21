#!/usr/bin/env bash
# nextjs-k8s-deploy: scaffold.sh
# Scaffold Next.js 14 app with Monaco editor, Tailwind, TypeScript.
set -euo pipefail

FRONTEND_DIR="learnflow-app/frontend"

if [ -d "$FRONTEND_DIR" ]; then
  echo "✓ Frontend directory exists, skipping scaffold (delete to re-scaffold)"
  exit 0
fi

# Scaffold Next.js 14
npx create-next-app@14 "$FRONTEND_DIR" \
  --typescript \
  --tailwind \
  --app \
  --no-git \
  --no-eslint \
  &>/dev/null

cd "$FRONTEND_DIR"

# Add Monaco editor
npm install @monaco-editor/react &>/dev/null

# Generate core pages
mkdir -p src/app/dashboard src/app/editor src/app/quiz src/app/teacher
mkdir -p src/components

cat > src/components/CodeEditor.tsx << 'EDITOR_EOF'
'use client';
import Editor from '@monaco-editor/react';
import { useState } from 'react';

interface CodeEditorProps {
  initialCode?: string;
  onRun?: (code: string) => void;
}

export default function CodeEditor({ initialCode = '# Write Python here\n', onRun }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);

  return (
    <div className="flex flex-col h-full">
      <Editor
        height="400px"
        defaultLanguage="python"
        value={code}
        onChange={(val) => setCode(val || '')}
        theme="vs-dark"
        options={{ minimap: { enabled: false }, fontSize: 14 }}
      />
      <button
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => onRun && onRun(code)}
      >
        ▶ Run Code
      </button>
    </div>
  );
}
EDITOR_EOF

cat > src/app/editor/page.tsx << 'EDITOR_PAGE_EOF'
'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { ssr: false });

export default function EditorPage() {
  const [output, setOutput] = useState('');

  const handleRun = async (code: string) => {
    setOutput('Running...');
    try {
      const res = await fetch('/api/v1/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setOutput(data.output || data.error || 'No output');
    } catch {
      setOutput('Error: could not reach code execution service');
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Python Editor</h1>
      <CodeEditor onRun={handleRun} />
      {output && (
        <div className="mt-4 p-4 bg-gray-900 text-green-400 rounded font-mono text-sm">
          <pre>{output}</pre>
        </div>
      )}
    </main>
  );
}
EDITOR_PAGE_EOF

cat > src/app/dashboard/page.tsx << 'DASH_EOF'
export default function Dashboard() {
  const modules = [
    { id: 1, name: 'Basics', progress: 80 },
    { id: 2, name: 'Control Flow', progress: 60 },
    { id: 3, name: 'Data Structures', progress: 40 },
    { id: 4, name: 'Functions', progress: 20 },
  ];
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Your Progress</h1>
      <div className="grid gap-4">
        {modules.map(m => (
          <div key={m.id} className="p-4 border rounded">
            <div className="flex justify-between mb-2">
              <span>{m.name}</span><span>{m.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded h-2">
              <div className="bg-blue-500 h-2 rounded" style={{width: `${m.progress}%`}} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
DASH_EOF

# Generate Dockerfile (multi-stage)
cat > Dockerfile << 'DOCKERFILE_EOF'
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
DOCKERFILE_EOF

# Add standalone output to next.config.ts
cat > next.config.ts << 'NEXTCONF_EOF'
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'standalone',
};
export default nextConfig;
NEXTCONF_EOF

# K8s manifests
mkdir -p k8s
cat > k8s/deployment.yaml << 'K8S_EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: learnflow
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: learnflow-frontend:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "http://kong-proxy.kong.svc.cluster.local:80"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 10
K8S_EOF

cat > k8s/service.yaml << 'SVC_EOF'
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
  namespace: learnflow
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
  - port: 3000
    targetPort: 3000
    nodePort: 30080
SVC_EOF

cd - &>/dev/null
echo "✓ Next.js frontend scaffolded (4 pages, Monaco editor, multi-stage Dockerfile)"
