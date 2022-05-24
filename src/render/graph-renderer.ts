import { svg } from "../dom";
import { Node, Relation, isNode, isRelation } from "../graph";

import './graph.css';

interface Graph {
  nodes: Map<number, Node>;
  relations: Map<number, Relation>;
}

interface Vec2 {
  x: number;
  y: number;
}

export const parseGraph = (graphData: any[]): Graph => {
  const result: Graph = {
    nodes: new Map(),
    relations: new Map(),
  };

  for (const entry of graphData) {
    if (isNode(entry)) result.nodes.set(entry.identity, entry);
    if (isRelation(entry)) result.relations.set(entry.identity, entry);
  }

  return result;
};

const renderNode = (node: Node, position: Vec2): SVGCircleElement => {
  const circle = svg("circle", "node") as SVGCircleElement;
  circle.dataset.id = String(node.identity);
  circle.dataset.props = JSON.stringify(node.properties);

  circle.setAttribute("cx", String(position.x));
  circle.setAttribute("cy", String(position.y));
  circle.setAttribute("r", "30");
  return circle;
}

const renderRelation = (relation: Relation, start: Vec2, end: Vec2): SVGLineElement => {
  const line = svg("line", "relation") as SVGLineElement;
  line.dataset.id = String(relation.identity);
  line.dataset.props = JSON.stringify(relation.properties);
  line.setAttribute("x1", String(start?.x));
  line.setAttribute("y1", String(start?.y));
  line.setAttribute("x2", String(end?.x));
  line.setAttribute("y2", String(end?.y));
  return line;
}

export const renderGraph = (
  graph: Graph,
  width: number,
  height: number
): SVGElement[] => {
  const result: SVGElement[] = [];

  const nodePositions = new Map<number, Vec2>();

  for (const node of graph.nodes.values()) {
    const position = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };

    nodePositions.set(node.identity, position);
    result.push(renderNode(node, position));
  }

  for (const relation of graph.relations.values()) {
    const start = nodePositions.get(relation.start)!;
    const end = nodePositions.get(relation.end)!;

    result.push(renderRelation(relation, start, end));
  }

  return result;
};

// import sampleData from '../../sample_data/records.json';
const sampleData = [
  {
    "m": {
      "identity": 154,
      "labels": ["Movie"],
      "properties": {
        "title": "Something's Gotta Give",
        "released": 2003
      }
    },
    "n": {
      "identity": 1,
      "labels": ["Person"],
      "properties": {
        "born": 1964,
        "name": "Keanu Reeves"
      }
    },
    "r": {
      "identity": 221,
      "start": 1,
      "end": 154,
      "type": "ACTED_IN",
      "properties": {
        "roles": ["Julian Mercer"]
      }
    }
  }
];

export const renderSampleData = () => {
  const graph = parseGraph(
    sampleData.flatMap(x => [...Object.values(x)])
  );

  return renderGraph(graph, 500, 500);
};
