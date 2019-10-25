import { filenameParse } from '../../src';

(window as any).filenameParse = filenameParse;

const input = document.querySelector<HTMLInputElement>('#input');
const output = document.querySelector<HTMLInputElement>('#output');
const isTv = document.querySelector<HTMLInputElement>('#isTv');

input.addEventListener('input', () => update());
isTv.addEventListener('input', () => update());

function update() {
  inputChange(input.value, isTv.checked);
}

function inputChange(str: string, isTv: boolean) {
  output.innerHTML = JSON.stringify(filenameParse(str, isTv), null, 2);
}

const initialDemo = 'Alita Battle Angel 2019 INTERNAL HDR 2160p WEB H265-DEFLATE';
input.value = initialDemo;
inputChange(initialDemo, false);
