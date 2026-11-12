/** Typed loader for `res/text/<lang>.json`. */
export const LOCALE_CODES = ['en', 'fr', 'it', 'de', 'es'] as const;
export type LocaleCode = (typeof LOCALE_CODES)[number];

export const LABEL_GROUPS = [
  'buildings',
  'items',
  'commands',
  'notices',
  'menuItems',
  'levels',
  'languages',
  'pageTitles',
  'roles',
  'villagerNames',
] as const;
export const MESSAGE_GROUPS = ['buildingDescriptions', 'alerts', 'targetingHints', 'prompts'] as const;

export interface LocaleText {
  menu: Record<string, string>;
  labels: Record<(typeof LABEL_GROUPS)[number], string[]>;
  messages: Record<(typeof MESSAGE_GROUPS)[number], string[]>;
  dialogue: string[];
}

function strings(v: unknown, label: string): string[] {
  if (!Array.isArray(v) || !v.every((s) => typeof s === 'string')) throw new Error(`locale: ${label} must be string[]`);
  return v;
}

function record(v: unknown, label: string): Record<string, unknown> {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) throw new Error(`locale: ${label} must be an object`);
  return v as Record<string, unknown>;
}

export function parseLocale(json: unknown): LocaleText {
  const root = record(json, 'root');
  const menuRaw = record(root.menu, 'menu');
  const menu: Record<string, string> = {};
  for (const [k, v] of Object.entries(menuRaw)) {
    if (typeof v !== 'string') throw new Error(`locale: menu.${k} must be a string`);
    menu[k] = v;
  }
  const labelsRaw = record(root.labels, 'labels');
  const messagesRaw = record(root.messages, 'messages');
  const labels = Object.fromEntries(LABEL_GROUPS.map((g) => [g, strings(labelsRaw[g], `labels.${g}`)])) as LocaleText['labels'];
  const messages = Object.fromEntries(
    MESSAGE_GROUPS.map((g) => [g, strings(messagesRaw[g], `messages.${g}`)]),
  ) as LocaleText['messages'];
  return { menu, labels, messages, dialogue: strings(root.dialogue, 'dialogue') };
}
