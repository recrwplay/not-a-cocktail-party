export const h = <T extends HTMLElement>(
  tag: string,
  className: string | null | undefined,
  ...children: (HTMLElement | string)[]
) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.append(...children);
  return el as T;
};

export const $ = (selector: string): HTMLDivElement => {
  const el = document.querySelector<HTMLDivElement>(selector);
  if (!el) throw new Error("No match for selector " + selector);
  return el;
};
