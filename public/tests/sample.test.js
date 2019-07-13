import * as Renderer from '../js/renderer.js';


const canvas = document.querySelector('canvas');
//var renderer = new Renderer(canvas);
var renderer = new Renderer(canvas);

test('Testing renderer', () => {
    expect(renderer.soup()).toBe(42);
  });