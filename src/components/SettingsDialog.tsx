import { useEffect, useState } from 'react';
import type { Client } from '@microsoft/microsoft-graph-client';
import { ensureBaseFolders, readJsonFile, writeJsonFile } from '../onedrive';
import type { Settings } from '../models';

export function SettingsDialog({ graph, onClose }: { graph: Client; onClose: () => void }) {
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { base } = await ensureBaseFolders(graph);
      const existing = await readJsonFile<Settings>(graph, base.id, 'settings.json');
      if (existing?.openaiApiKey) setApiKey(existing.openaiApiKey);
    })();
  }, [graph]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { base } = await ensureBaseFolders(graph);
      const settings: Settings = { openaiApiKey: apiKey || undefined };
      await writeJsonFile(graph, base.id, 'settings.json', settings);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <label className="block text-sm mb-1">OpenAI API Key</label>
        <input className="input w-full mb-4" placeholder="sk-..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        <div className="flex gap-2 justify-end">
          <button className="button" onClick={onClose}>Cancel</button>
          <button className="button" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}