import { h } from './dom';

const mousePos = {x: 0, y: 0};
let popup: HTMLDivElement | null = null;
let currentPopupId: any = null;

window.addEventListener('mousemove', (e) => {
  mousePos.x = e.pageX;
  mousePos.y = e.pageY;
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

export const despawnPopup = () => {
  popup?.remove();
  popup = null;
  currentPopupId = null;
};

export const spawnPopup = (id: any, content: any) => {
  if (id === currentPopupId) {
    return;
  }
  if (popup) {
    despawnPopup();
  }

  popup = h<HTMLDivElement>("div", "popup", content);
  popup.style.left = `${mousePos.x}px`;
  popup.style.top = `${mousePos.y}px`;
  document.body.append(popup);

  currentPopupId = id;
}
