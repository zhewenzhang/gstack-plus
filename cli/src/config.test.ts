import { describe, it, expect } from 'vitest';

describe('config module', () => {
  it('module loads and exports expected functions', async () => {
    const mod = await import('./config.js');
    expect(mod.loadConfig).toBeDefined();
    expect(mod.saveConfig).toBeDefined();
    expect(mod.setConfigValue).toBeDefined();
    expect(mod.getConfigValue).toBeDefined();
    expect(mod.getConfigPath).toBeDefined();
  });
  it('getConfigPath returns a string', async () => {
    const { getConfigPath } = await import('./config.js');
    expect(typeof getConfigPath()).toBe('string');
  });
});
