export interface Node {
  identity: number;
  labels: string[];
  properties: Record<string, any>;
}

export interface Relation {
  identity: number;
  type: string;
  properties: Record<string, any>;
  start: number;
  end: number;
}

export const isNode = (x: any): x is Node => {
  if (!x) return false;
  return (
    typeof x.identity === "number" &&
    Array.isArray(x.labels) &&
    x.type === undefined
  );
};

export const isRelation = (x: any): x is Relation => {
  if (!x) return false;
  return (
    typeof x.identity === "number" &&
    x.labels === undefined &&
    typeof x.type === "string"
  );
};
