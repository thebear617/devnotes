import { debugParser } from './debug.mjs';
import { knowledgeParser } from './knowledge.mjs';
import { timelineParser } from './timeline.mjs';

export const parsers = [knowledgeParser, timelineParser, debugParser];
export const parserMap = new Map(parsers.map((parser) => [parser.id, parser]));
