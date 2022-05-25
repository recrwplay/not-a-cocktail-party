import { h } from './dom';

const mousePos = {x: 0, y: 0};
let popup: HTMLDivElement | null = null;

window.addEventListener('mousemove', (e) => {
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
})

document.body.addEventListener('click', (e) => {
  if (!popup) return;

  let clickedInsidePopup = false;
  let node: HTMLElement | null = e.target as HTMLElement;

  while (node) {
    if (node === popup) {
      clickedInsidePopup = true;
      break;
    }
    node = node.parentElement;
  }

  if (!clickedInsidePopup) {
    despawnPopup();
  }
});

const despawnPopup = () => {
  popup?.remove();
  popup = null;
};

export const spawnPopup = (content: any) => {
  if (popup) {
    despawnPopup();
  }

  popup = h<HTMLDivElement>("div", "popup", content);
  popup.style.left = `${mousePos.x}px`;
  popup.style.top = `${mousePos.y}px`;
  document.body.append(popup);
}
