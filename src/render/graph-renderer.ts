import { h, svg } from "../dom";
import { Node, Relationship } from "../graph";
import { spawnPopup } from "../popup";

import "./graph.css";

interface Vec2 {
  x: number;
  y: number;
}

const renderNode = (node: Node, position: Vec2): SVGElement => {
  const circle = svg("circle", "node") as SVGCircleElement;
  circle.dataset.id = String(node.id);
  circle.dataset.props = JSON.stringify(node.properties);

  // circle.setAttribute("cx", String(position.x));
  // circle.setAttribute("cy", String(position.y));
  circle.setAttribute("r", "50");

  const label = svg("text", "label");
  label.textContent = node.labels;
  label.setAttribute("text-anchor", "middle");

  const id = svg("text", "id");
  id.textContent = `id: ${node.id}`;
  id.setAttribute("text-anchor", "middle");
  id.setAttribute("transform", "translate(0 20)");

  const group = svg("g");
  group.setAttribute("transform", `translate(${position.x} ${position.y})`);

  group.append(circle, label, id);

  group.addEventListener("mouseover", (e) => {
    e.stopPropagation();
    spawnPopup(
      node.id,
      h("pre", null, JSON.stringify(node.properties, null, "  "))
    );
  });

  return group;
};

const renderRelation = (
  relation: Relationship,
  start: Vec2,
  end: Vec2
): SVGLineElement => {
  const line = svg("line", "relation") as SVGLineElement;
  line.dataset.id = String(relation.id);
  line.dataset.props = JSON.stringify(relation.properties);
  line.setAttribute("x1", String(start?.x));
  line.setAttribute("y1", String(start?.y));
  line.setAttribute("x2", String(end?.x));
  line.setAttribute("y2", String(end?.y));
  return line;
};

export const renderGraph = (
  nodes: Node[],
  relations: Relationship[],
  width: number,
  height: number
): SVGElement[] => {
  const result: SVGElement[] = [];

  const nodePositions = new Map<number, Vec2>();

  const middle = { x: width / 2, y: height / 2 };
  const goodPositions: Vec2[] = [middle];

  const circlePositions = 9;
  for (let i = 0; i < circlePositions; i++) {
    const radius = 200;
    const angle = (i / circlePositions) * 2 * Math.PI;
    goodPositions.push({
      x: middle.x + Math.cos(angle) * radius,
      y: middle.y + Math.sin(angle) * radius,
    });
  }

  const padding = -50;
  const randomPosition = () => ({
    x: padding + Math.floor(Math.random() * (width - padding * 2)),
    y: padding + Math.floor(Math.random() * (height - padding * 2)),
  });

  for (const node of nodes.values()) {
    const [goodPos] = goodPositions.splice(0, 1);
    const position = goodPos || randomPosition();

    nodePositions.set(node.id, position);
    result.push(renderNode(node, position));
  }

  for (const relation of relations.values()) {
    const start = nodePositions.get(relation.start)!;
    const end = nodePositions.get(relation.end)!;

    result.push(renderRelation(relation, start, end));
  }

  return result.reverse();
};
