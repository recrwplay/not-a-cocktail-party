export interface Node {
  id: number;
  labels: string;
  properties: Record<string, any>;
}

export interface Relationship {
  id: number;
  type: string;
  properties: Record<string, any>;
  start: number;
  end: number;
}
