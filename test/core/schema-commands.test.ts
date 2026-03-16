import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  COMMAND_NAMESPACE,
  getSchemaCommandsDir,
  schemaHasCommands,
  loadSchemaCommands,
  processSchemaCommands,
  getSchemaCommandsConfig,
} from '../../src/core/schema-commands.js';

describe('schema-commands', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = path.join(os.tmpdir(), `openspec-schema-commands-test-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('COMMAND_NAMESPACE', () => {
    it('should be "opsx"', () => {
      expect(COMMAND_NAMESPACE).toBe('opsx');
    });
  });

  describe('getSchemaCommandsDir', () => {
    it('should return null for non-existent schema', () => {
      const result = getSchemaCommandsDir('non-existent-schema', testDir);
      expect(result).toBeNull();
    });

    it('should return commands directory path for analytics-eng schema', () => {
      const result = getSchemaCommandsDir('analytics-eng');
      expect(result).not.toBeNull();
      expect(result).toContain('analytics-eng');
      expect(result).toContain('commands');
      expect(result).toContain('opsx');
    });
  });

  describe('schemaHasCommands', () => {
    it('should return false for non-existent schema', () => {
      const result = schemaHasCommands('non-existent-schema', testDir);
      expect(result).toBe(false);
    });

    it('should return true for analytics-eng schema', () => {
      const result = schemaHasCommands('analytics-eng');
      expect(result).toBe(true);
    });

    it('should return false for spec-driven schema (no custom commands)', () => {
      const result = schemaHasCommands('spec-driven');
      expect(result).toBe(false);
    });
  });

  describe('loadSchemaCommands', () => {
    it('should return empty array for non-existent schema', () => {
      const result = loadSchemaCommands('non-existent-schema', testDir);
      expect(result).toEqual([]);
    });

    it('should load commands from analytics-eng schema', () => {
      const commands = loadSchemaCommands('analytics-eng');

      expect(commands.length).toBeGreaterThan(0);

      // Check structure of loaded commands
      for (const cmd of commands) {
        expect(cmd.id).toBeTruthy();
        expect(cmd.schemaName).toBe('analytics-eng');
        expect(cmd.content).toBeTruthy();
        expect(cmd.path).toContain('analytics-eng');
      }
    });

    it('should load expected analytics-eng commands', () => {
      const commands = loadSchemaCommands('analytics-eng');
      const commandIds = commands.map(c => c.id);

      // analytics-eng has these commands
      expect(commandIds).toContain('investigate');
      expect(commandIds).toContain('explore');
      expect(commandIds).toContain('analyze');
      expect(commandIds).toContain('deliver');
      expect(commandIds).toContain('archive');
    });
  });

  describe('processSchemaCommands', () => {
    it('should convert schema commands to CommandContent format', () => {
      const commands = loadSchemaCommands('analytics-eng');
      const processed = processSchemaCommands(commands);

      expect(processed.length).toBe(commands.length);

      for (const cmd of processed) {
        expect(cmd.id).toBeTruthy();
        expect(cmd.name).toBeTruthy();
        expect(typeof cmd.description).toBe('string');
        expect(cmd.category).toBeTruthy();
        expect(Array.isArray(cmd.tags)).toBe(true);
        expect(typeof cmd.body).toBe('string');
      }
    });

    it('should parse frontmatter from command files', () => {
      const commands = loadSchemaCommands('analytics-eng');
      const processed = processSchemaCommands(commands);

      const investigate = processed.find(c => c.id === 'investigate');
      expect(investigate).toBeDefined();
      expect(investigate?.name).toBeTruthy();
      expect(investigate?.description).toBeTruthy();
      expect(investigate?.category).toBe('Analytics');
    });

    it('should extract body content after frontmatter', () => {
      const commands = loadSchemaCommands('analytics-eng');
      const processed = processSchemaCommands(commands);

      for (const cmd of processed) {
        // Body should not contain frontmatter delimiters
        expect(cmd.body).not.toMatch(/^---\n/);
        // Body should have actual content
        expect(cmd.body.length).toBeGreaterThan(0);
      }
    });

    it('should return empty array for empty input', () => {
      const processed = processSchemaCommands([]);
      expect(processed).toEqual([]);
    });
  });

  describe('getSchemaCommandsConfig', () => {
    it('should return undefined for non-existent schema', () => {
      const result = getSchemaCommandsConfig('non-existent-schema', testDir);
      expect(result).toBeUndefined();
    });

    it('should return commands config for analytics-eng schema', () => {
      const config = getSchemaCommandsConfig('analytics-eng');

      expect(config).toBeDefined();
      expect(config?.mode).toBe('replace');
    });

    it('should return undefined for spec-driven schema (no commands config)', () => {
      const config = getSchemaCommandsConfig('spec-driven');
      expect(config).toBeUndefined();
    });
  });
});
