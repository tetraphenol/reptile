import { useEffect, useMemo, useState } from 'react';
import { MsalProvider, useIsAuthenticated, useMsal } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './msalConfig';
import { LoginDialog } from './components/LoginDialog';
import { UserMenu } from './components/UserMenu';
import { createGraphClient } from './graph';
import { ensureBaseFolders, listJsonFiles, readJsonFile, writeJsonFile } from './onedrive';
import type { Project } from './models';
import { SettingsDialog } from './components/SettingsDialog';
import { sanitizeFileName } from './utils';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Card, CardContent } from './components/ui/card';

const msalInstance = new PublicClientApplication(msalConfig);

function AppShell() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const account = accounts[0];

  const graph = useMemo(() => (isAuthenticated && account ? createGraphClient(instance, account) : null), [isAuthenticated, account, instance]);

  const [project, setProject] = useState<Project | null>(null);
  const [dirty, setDirty] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saving, setSaving] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = project?.name ? `${project.name} • Reptile` : 'Reptile';
  }, [project?.name]);

  // Initial load: ensure folders, load settings + projects; create ephemeral if none
  useEffect(() => {
    if (!graph) return;
    (async () => {
      const { projects } = await ensureBaseFolders(graph);
      const files = await listJsonFiles(graph, projects.id);
      if (!files.length) {
        const newProject: Project = {
          id: null,
          name: 'Untitled Project',
          content: '',
          updatedAt: new Date().toISOString(),
        };
        setProject(newProject);
        setDirty(false);
        return;
      }
      // Load the first project for now
      const first = files[0];
      const loaded = await readJsonFile<Project>(graph, projects.id, first.name);
      if (loaded) {
        setProject({ ...loaded, id: first.id });
        setDirty(false);
      }
    })();
  }, [graph]);

  // Autosave on changes (debounced)
  useEffect(() => {
    if (!graph || !project) return;
    if (!dirty) return;

    const handle = setTimeout(async () => {
      setSaving(true);
      try {
        const { projects } = await ensureBaseFolders(graph);
        let fileName: string;
        if (project.id) {
          // Update existing by uploading with same name (id not used by upload URL)
          fileName = await ensureProjectFileName(graph, projects.id, project.name, project.id);
        } else {
          fileName = await generateUniqueProjectFileName(graph, projects.id, project.name);
        }
        const saved = await writeJsonFile(graph, projects.id, fileName, { ...project, updatedAt: new Date().toISOString() });
        setProject((p) => (p ? { ...p, id: saved.id } : p));
        setDirty(false);
      } finally {
        setSaving(false);
      }
    }, 1500);

    return () => clearTimeout(handle);
  }, [graph, project, dirty]);

  const isReady = !!graph;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="max-w-6xl mx-auto flex items-center gap-3 p-3">
          <div className="font-semibold bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">Reptile</div>
          <Input
            className="flex-1"
            value={project?.name || ''}
            onChange={(e) => { if (project) { setProject({ ...project, name: e.target.value }); setDirty(true); } }}
            placeholder="Project name"
          />
          {saving && (
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="h-2.5 w-2.5 rounded-full bg-brand animate-pulse"></span>
              Saving…
            </div>
          )}
          {isAuthenticated && graph && (
            <UserMenu onOpenSettings={() => setShowSettings(true)} />
          )}
        </div>
      </header>

      <main className="flex-1">
        {!isAuthenticated && <LoginDialog />}
        {isAuthenticated && isReady && (
          <div className="max-w-6xl mx-auto p-4">
            <Card className="p-4 md:p-6">
              <CardContent className="p-0">
                <Textarea
                  className="w-full h-[60vh] md:h-[65vh] resize-y leading-relaxed"
                  placeholder="Start writing your report…"
                  value={project?.content || ''}
                  onChange={(e) => { if (project) { setProject({ ...project, content: e.target.value }); setDirty(true); } }}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {showSettings && graph && (
        <SettingsDialog graph={graph} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

async function generateUniqueProjectFileName(graph: any, parentId: string, name: string): Promise<string> {
  const base = sanitizeFileName(name || 'Project');
  let candidate = `${base}.json`;
  let index = 1;
  const existing = await listJsonFiles(graph, parentId);
  const names = new Set(existing.map((f) => f.name));
  while (names.has(candidate)) {
    candidate = `${base} ${index++}.json`;
  }
  return candidate;
}

async function ensureProjectFileName(graph: any, parentId: string, name: string, id: string): Promise<string> {
  // Try to find current file name by id
  const files = await listJsonFiles(graph, parentId);
  const current = files.find((f) => f.id === id);
  if (current) return current.name;
  return generateUniqueProjectFileName(graph, parentId, name);
}

export default function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AppShell />
    </MsalProvider>
  );
}
