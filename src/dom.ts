export const h = <T extends HTMLElement>(
  tag: string,
  className: string | null | undefined,
  ...children: (HTMLElement | string)[]
) => {
  const el = document.createElement(tag);
  if (className) el.classList.add(className);
  el.append(...children);
  return el as T;
};

export function $<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error("No match for selector " + selector);
  return el;
}

export const svg = <T extends SVGElement>(
  tag: string,
  className?: string | null | undefined,
  ...children: SVGElement[]
): T => {
  const xmlns = "http://www.w3.org/2000/svg";
  const el = document.createElementNS(xmlns, tag);
  if (className) el.classList.add(className);
  el.append(...children);
  return el as T;
};
