import * as monaco from './monaco';

export declare interface MonacoEnvironment {
  base?: MonacoEnvironment.base;
  getWorker?: MonacoEnvironment.getWorker;
}

export declare namespace MonacoEnvironment {
  export type base = string;
  export type moduleID = string;
  export type label = string;

  export function getWorker(
    moduleID: moduleID,
    label: label,
    base?: base,
    dynamic?: boolean,
  ): Worker;

  export type getWorker = typeof getWorker;
}

export declare const getWorker: MonacoEnvironment.getWorker;

declare const exporter: (environment?: object) => MonacoEnvironment;

export default exporter;
