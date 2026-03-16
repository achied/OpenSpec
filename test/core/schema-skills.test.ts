import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  getSchemaSkillsDir,
  schemaHasSkills,
  loadSchemaSkills,
  getSchemaSkillsConfig,
  processSchemaSkills,
} from '../../src/core/schema-skills.js';

describe('schema-skills', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = path.join(os.tmpdir(), `openspec-schema-skills-test-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('getSchemaSkillsDir', () => {
    it('should return null for non-existent schema', () => {
      const result = getSchemaSkillsDir('non-existent-schema', testDir);
      expect(result).toBeNull();
    });

    it('should return skills directory path for analytics-eng schema', () => {
      // analytics-eng is a built-in schema
      const result = getSchemaSkillsDir('analytics-eng');
      expect(result).not.toBeNull();
      expect(result).toContain('analytics-eng');
      expect(result).toContain('skills');
    });
  });

  describe('schemaHasSkills', () => {
    it('should return false for non-existent schema', () => {
      const result = schemaHasSkills('non-existent-schema', testDir);
      expect(result).toBe(false);
    });

    it('should return true for analytics-eng schema', () => {
      const result = schemaHasSkills('analytics-eng');
      expect(result).toBe(true);
    });

    it('should return false for spec-driven schema (no custom skills)', () => {
      const result = schemaHasSkills('spec-driven');
      expect(result).toBe(false);
    });
  });

  describe('loadSchemaSkills', () => {
    it('should return empty array for non-existent schema', () => {
      const result = loadSchemaSkills('non-existent-schema', testDir);
      expect(result).toEqual([]);
    });

    it('should load skills from analytics-eng schema', () => {
      const skills = loadSchemaSkills('analytics-eng');

      expect(skills.length).toBeGreaterThan(0);

      // Check structure of loaded skills
      for (const skill of skills) {
        expect(skill.id).toBeTruthy();
        expect(skill.schemaName).toBe('analytics-eng');
        expect(skill.content).toContain('---');
        expect(skill.path).toContain('analytics-eng');
      }
    });

    it('should load expected analytics-eng skills', () => {
      const skills = loadSchemaSkills('analytics-eng');
      const skillIds = skills.map(s => s.id);

      // analytics-eng has these skills
      expect(skillIds).toContain('openspec-investigate');
      expect(skillIds).toContain('openspec-explore');
      expect(skillIds).toContain('openspec-analyze');
      expect(skillIds).toContain('openspec-deliver');
      expect(skillIds).toContain('openspec-archive');
      expect(skillIds).toContain('openspec-present');
    });
  });

  describe('getSchemaSkillsConfig', () => {
    it('should return undefined for non-existent schema', () => {
      const result = getSchemaSkillsConfig('non-existent-schema', testDir);
      expect(result).toBeUndefined();
    });

    it('should return skills config for analytics-eng schema', () => {
      const config = getSchemaSkillsConfig('analytics-eng');

      expect(config).toBeDefined();
      expect(config?.mode).toBe('replace');
    });

    it('should return undefined for spec-driven schema (no skills config)', () => {
      const config = getSchemaSkillsConfig('spec-driven');
      expect(config).toBeUndefined();
    });
  });

  describe('processSchemaSkills', () => {
    it('should process skills with schema prefix in dirName', () => {
      const skills = loadSchemaSkills('analytics-eng');
      const processed = processSchemaSkills(skills, '1.0.0');

      expect(processed.length).toBe(skills.length);

      for (const skill of processed) {
        // dirName should have schema prefix
        expect(skill.dirName).toMatch(/^analytics-eng-/);
        // content should have generatedBy injected
        expect(skill.content).toContain('generatedBy');
      }
    });

    it('should inject generatedBy version into skill content', () => {
      const skills = loadSchemaSkills('analytics-eng');
      const version = '2.5.0';
      const processed = processSchemaSkills(skills, version);

      for (const skill of processed) {
        expect(skill.content).toContain(`generatedBy: "${version}"`);
      }
    });

    it('should return empty array for empty input', () => {
      const processed = processSchemaSkills([], '1.0.0');
      expect(processed).toEqual([]);
    });
  });
});
