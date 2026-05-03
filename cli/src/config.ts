import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';

export type Config = {
  lang?: 'zh' | 'en';
  handoffDir?: string;
};

const CONFIG_PATH = join(homedir(), '.gstack-plus.json');

export async function loadConfig(): Promise<Config> {
  try {
    const content = await readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

export async function saveConfig(config: Config): Promise<void> {
  await mkdir(dirname(CONFIG_PATH), { recursive: true });
  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

export async function setConfigValue(key: keyof Config, value: string): Promise<void> {
  const current = await loadConfig();
  if (key === 'lang' && (value === 'zh' || value === 'en')) {
    current.lang = value;
  } else if (key === 'handoffDir') {
    current.handoffDir = value;
  } else {
    throw new Error(`Unknown config key: ${key}`);
  }
  await saveConfig(current);
}

export async function getConfigValue(key: keyof Config): Promise<string | undefined> {
  const config = await loadConfig();
  const val = config[key];
  return val ? String(val) : undefined;
}

export function getConfigPath(): string {
  return CONFIG_PATH;
}
