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

export function $<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error("No match for selector " + selector);
  return el;
};
