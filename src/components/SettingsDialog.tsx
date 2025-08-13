import { useEffect, useState } from 'react';
import type { Client } from '@microsoft/microsoft-graph-client';
import { ensureBaseFolders, readJsonFile, writeJsonFile } from '../onedrive';
import type { Settings } from '../models';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

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
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="apiKey">OpenAI API Key</Label>
          <Input id="apiKey" placeholder="sk-..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}