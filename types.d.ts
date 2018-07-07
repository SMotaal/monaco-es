import * as monaco from 'monaco-editor';

declare global {
  type monaco = typeof monaco;
}

export {monaco};
