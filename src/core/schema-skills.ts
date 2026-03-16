/**
 * Schema Skills
 *
 * Handles loading and processing of schema-specific skills.
 * Skills defined in schemas/<name>/skills/ are installed when
 * a project uses that schema.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { getSchemaDir } from './artifact-graph/resolver.js';
import { resolveSchema } from './artifact-graph/resolver.js';
import type { SkillsConfig } from './artifact-graph/types.js';

/**
 * Schema skill definition loaded from schema's skills directory.
 */
export interface SchemaSkill {
  /** Skill identifier (directory name) */
  id: string;
  /** Schema this skill belongs to */
  schemaName: string;
  /** Full content of SKILL.md file */
  content: string;
  /** Path to the skill directory */
  path: string;
}

/**
 * Processed skill ready for installation.
 */
export interface ProcessedSkill {
  /** Directory name for installation (e.g., "analytics-eng-analyze") */
  dirName: string;
  /** Processed content with metadata */
  content: string;
}

/**
 * Gets the skills directory for a schema.
 */
export function getSchemaSkillsDir(
  schemaName: string,
  projectRoot?: string
): string | null {
  const schemaDir = getSchemaDir(schemaName, projectRoot);
  if (!schemaDir) return null;

  const skillsDir = path.join(schemaDir, 'skills');
  if (fs.existsSync(skillsDir)) {
    return skillsDir;
  }

  return null;
}

/**
 * Checks if a schema has custom skills defined.
 */
export function schemaHasSkills(
  schemaName: string,
  projectRoot?: string
): boolean {
  const skillsDir = getSchemaSkillsDir(schemaName, projectRoot);
  if (!skillsDir) return false;

  try {
    const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
    return entries.some(entry => {
      if (!entry.isDirectory()) return false;
      const skillFile = path.join(skillsDir, entry.name, 'SKILL.md');
      return fs.existsSync(skillFile);
    });
  } catch {
    return false;
  }
}

/**
 * Loads all skills defined in a schema's skills directory.
 */
export function loadSchemaSkills(
  schemaName: string,
  projectRoot?: string
): SchemaSkill[] {
  const skillsDir = getSchemaSkillsDir(schemaName, projectRoot);
  if (!skillsDir) return [];

  const skills: SchemaSkill[] = [];

  try {
    for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;

      const skillFile = path.join(skillsDir, entry.name, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        try {
          const content = fs.readFileSync(skillFile, 'utf-8');
          skills.push({
            id: entry.name,
            schemaName,
            content,
            path: path.join(skillsDir, entry.name),
          });
        } catch {
          // Skip unreadable skill files
        }
      }
    }
  } catch {
    // Skip if skills directory is unreadable
  }

  return skills;
}

/**
 * Gets the skills configuration for a schema.
 */
export function getSchemaSkillsConfig(
  schemaName: string,
  projectRoot?: string
): SkillsConfig | undefined {
  try {
    const schema = resolveSchema(schemaName, projectRoot);
    return schema.skills;
  } catch {
    return undefined;
  }
}

/**
 * Injects generatedBy metadata into a SKILL.md content.
 * Preserves existing frontmatter and adds/updates the generatedBy field.
 */
function injectGeneratedBy(content: string, version: string): string {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!frontmatterMatch) {
    // No frontmatter, return as-is
    return content;
  }

  const frontmatter = frontmatterMatch[1];
  const body = content.slice(frontmatterMatch[0].length);

  // Check if metadata section exists
  if (frontmatter.includes('metadata:')) {
    // Check if generatedBy already exists in metadata
    if (frontmatter.includes('generatedBy:')) {
      // Update existing generatedBy
      const updated = frontmatter.replace(
        /generatedBy:\s*["']?[^"'\n]*["']?/,
        `generatedBy: "${version}"`
      );
      return `---\n${updated}\n---${body}`;
    } else {
      // Add generatedBy to existing metadata
      const updated = frontmatter.replace(
        /(metadata:)/,
        `$1\n  generatedBy: "${version}"`
      );
      return `---\n${updated}\n---${body}`;
    }
  } else {
    // Add metadata section with generatedBy
    const updated = `${frontmatter}\nmetadata:\n  generatedBy: "${version}"`;
    return `---\n${updated}\n---${body}`;
  }
}

/**
 * Processes schema skills for installation.
 * - Adds generatedBy metadata
 * - Generates unique directory names using schema prefix
 */
export function processSchemaSkills(
  skills: SchemaSkill[],
  openspecVersion: string
): ProcessedSkill[] {
  return skills.map(skill => ({
    // Use schema name as prefix to avoid conflicts with default skills
    dirName: `${skill.schemaName}-${skill.id}`,
    content: injectGeneratedBy(skill.content, openspecVersion),
  }));
}
