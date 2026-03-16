/**
 * Schema Commands
 *
 * Handles loading and processing of schema-specific commands.
 * Commands defined in schemas/<name>/commands/opsx/ are installed when
 * a project uses that schema, replacing the default commands.
 *
 * The 'opsx' namespace is the standard for all tools - each adapter
 * transforms the output path according to its tool's conventions.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { getSchemaDir, resolveSchema } from './artifact-graph/resolver.js';
import type { CommandContent } from './command-generation/types.js';
import type { CommandsConfig } from './artifact-graph/types.js';

/**
 * Standard command namespace used by all tools.
 * Schema commands are located in schemas/<name>/commands/<COMMAND_NAMESPACE>/
 */
export const COMMAND_NAMESPACE = 'opsx';

/**
 * Schema command definition loaded from schema's commands directory.
 */
export interface SchemaCommand {
  /** Command identifier (filename without .md) */
  id: string;
  /** Schema this command belongs to */
  schemaName: string;
  /** Full content of command .md file */
  content: string;
  /** Path to the command file */
  path: string;
}

/**
 * Parsed command frontmatter.
 */
interface CommandFrontmatter {
  name: string;
  description: string;
  category: string;
  tags: string[];
}

/**
 * Gets the commands directory for a schema.
 * Commands are located in schemas/<name>/commands/opsx/
 */
export function getSchemaCommandsDir(
  schemaName: string,
  projectRoot?: string
): string | null {
  const schemaDir = getSchemaDir(schemaName, projectRoot);
  if (!schemaDir) return null;

  const commandsDir = path.join(schemaDir, 'commands', COMMAND_NAMESPACE);
  if (fs.existsSync(commandsDir)) {
    return commandsDir;
  }

  return null;
}

/**
 * Checks if a schema has custom commands defined.
 */
export function schemaHasCommands(
  schemaName: string,
  projectRoot?: string
): boolean {
  const commandsDir = getSchemaCommandsDir(schemaName, projectRoot);
  if (!commandsDir) return false;

  try {
    const entries = fs.readdirSync(commandsDir);
    return entries.some(entry => entry.endsWith('.md'));
  } catch {
    return false;
  }
}

/**
 * Loads all commands defined in a schema's commands directory.
 */
export function loadSchemaCommands(
  schemaName: string,
  projectRoot?: string
): SchemaCommand[] {
  const commandsDir = getSchemaCommandsDir(schemaName, projectRoot);
  if (!commandsDir) return [];

  const commands: SchemaCommand[] = [];

  try {
    for (const entry of fs.readdirSync(commandsDir)) {
      if (!entry.endsWith('.md')) continue;

      const commandFile = path.join(commandsDir, entry);
      const stat = fs.statSync(commandFile);
      if (!stat.isFile()) continue;

      try {
        const content = fs.readFileSync(commandFile, 'utf-8');
        const id = entry.replace(/\.md$/, '');
        commands.push({
          id,
          schemaName,
          content,
          path: commandFile,
        });
      } catch {
        // Skip unreadable command files
      }
    }
  } catch {
    // Skip if commands directory is unreadable
  }

  return commands;
}

/**
 * Parses YAML frontmatter from command content.
 */
function parseFrontmatter(content: string): CommandFrontmatter | null {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];

  // Simple YAML parsing for the fields we need
  const nameMatch = frontmatter.match(/^name:\s*["']?(.+?)["']?\s*$/m);
  const descMatch = frontmatter.match(/^description:\s*["']?(.+?)["']?\s*$/m);
  const categoryMatch = frontmatter.match(/^category:\s*["']?(.+?)["']?\s*$/m);
  const tagsMatch = frontmatter.match(/^tags:\s*\[([^\]]*)\]/m);

  const name = nameMatch?.[1]?.trim() || '';
  const description = descMatch?.[1]?.trim() || '';
  const category = categoryMatch?.[1]?.trim() || 'Workflow';

  let tags: string[] = [];
  if (tagsMatch) {
    tags = tagsMatch[1]
      .split(',')
      .map(t => t.trim().replace(/^["']|["']$/g, ''))
      .filter(t => t.length > 0);
  }

  return { name, description, category, tags };
}

/**
 * Extracts the body content (after frontmatter) from command content.
 */
function extractBody(content: string): string {
  const frontmatterMatch = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (!frontmatterMatch) return content;
  return content.slice(frontmatterMatch[0].length).trim();
}

/**
 * Processes schema commands into CommandContent format.
 */
export function processSchemaCommands(
  commands: SchemaCommand[]
): CommandContent[] {
  return commands.map(cmd => {
    const frontmatter = parseFrontmatter(cmd.content);
    const body = extractBody(cmd.content);

    return {
      id: cmd.id,
      name: frontmatter?.name || cmd.id,
      description: frontmatter?.description || '',
      category: frontmatter?.category || 'Workflow',
      tags: frontmatter?.tags || [],
      body,
    };
  });
}

/**
 * Gets the commands configuration for a schema.
 */
export function getSchemaCommandsConfig(
  schemaName: string,
  projectRoot?: string
): CommandsConfig | undefined {
  try {
    const schema = resolveSchema(schemaName, projectRoot);
    return schema.commands;
  } catch {
    return undefined;
  }
}
