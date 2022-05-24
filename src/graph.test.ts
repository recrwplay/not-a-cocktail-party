import { isNode, isRelation } from "./graph";
import records from "../sample_data/records.json";

describe("Graph utils", () => {
  test("isNode", () => {
    for (const entry of records) {
      expect(isNode(entry.m)).toBe(true);
      expect(isNode(entry.n)).toBe(true);
      expect(isNode(entry.r)).toBe(false);
    }
  });
  test("isRelation", () => {
    for (const entry of records) {
      expect(isRelation(entry.m)).toBe(false);
      expect(isRelation(entry.n)).toBe(false);
      expect(isRelation(entry.r)).toBe(true);
    }
  });
});
