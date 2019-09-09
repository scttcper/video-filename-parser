import { filenameParse } from '../../src';

(window as any).filenameParse = filenameParse;

const input = document.querySelector<HTMLInputElement>('#input');
const output = document.querySelector<HTMLInputElement>('#output');

input.addEventListener('input', event => inputChange((event.target as HTMLInputElement).value));

function inputChange(str: string) {
  output.innerHTML = JSON.stringify(filenameParse(str), null, 2);
}

const initialDemo = 'Alita Battle Angel 2019 INTERNAL HDR 2160p WEB H265-DEFLATE';
input.value = initialDemo;
inputChange(initialDemo);
