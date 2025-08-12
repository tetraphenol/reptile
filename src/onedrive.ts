import type { Client } from '@microsoft/microsoft-graph-client';

const ROOT_FOLDER = 'Reptile';
const PROJECTS_FOLDER = 'projects';

export interface DriveItemRef {
  id: string;
  name: string;
}

export async function ensureBaseFolders(graph: Client): Promise<{ base: DriveItemRef; projects: DriveItemRef; }>{
  const base = await ensureChildFolder(graph, 'root', ROOT_FOLDER);
  const projects = await ensureChildFolder(graph, base.id, PROJECTS_FOLDER);
  return { base, projects };
}

async function ensureChildFolder(graph: Client, parentId: string, childName: string): Promise<DriveItemRef> {
  // Try to find existing
  const listUrl = parentId === 'root' ? `/me/drive/root/children?$select=id,name,folder` : `/me/drive/items/${parentId}/children?$select=id,name,folder`;
  const children = await graph.api(listUrl).get();
  const existing = children.value?.find((c: any) => c.name === childName && c.folder);
  if (existing) return { id: existing.id, name: existing.name };

  // Create
  const createUrl = parentId === 'root' ? `/me/drive/root/children` : `/me/drive/items/${parentId}/children`;
  const created = await graph.api(createUrl).post({
    name: childName,
    folder: {},
    '@microsoft.graph.conflictBehavior': 'rename',
  });
  return { id: created.id, name: created.name };
}

export async function readJsonFile<T>(graph: Client, parentId: string, fileName: string): Promise<T | null> {
  try {
    const children = await graph.api(`/me/drive/items/${parentId}/children?$select=id,name,file`).get();
    const item = children.value?.find((c: any) => c.name === fileName && c.file);
    if (!item) return null;
    const content = await graph.api(`/me/drive/items/${item.id}/content`).get();
    return JSON.parse(typeof content === 'string' ? content : await (content as Response).text());
  } catch {
    return null;
  }
}

export async function writeJsonFile(graph: Client, parentId: string, fileName: string, data: unknown): Promise<DriveItemRef> {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const uploadUrl = `/me/drive/items/${parentId}:/${encodeURIComponent(fileName)}:/content`;
  const uploaded = await graph.api(uploadUrl).put(blob);
  return { id: uploaded.id, name: uploaded.name };
}

export async function listJsonFiles(graph: Client, parentId: string): Promise<Array<{ id: string; name: string }>> {
  const children = await graph.api(`/me/drive/items/${parentId}/children?$select=id,name,file`).get();
  return (children.value || []).filter((c: any) => c.file && c.name.endsWith('.json')).map((c: any) => ({ id: c.id, name: c.name }));
}