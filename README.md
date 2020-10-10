# 3D City Visualizer

This is a super simple 3D modeller built for the browser. It is meant to be a visualization tool for a 3D city block. It's a simple experiment in graphics programming using WebGL.

<br>

<img src="./demo.gif">

<br>
<br>

## Getting Started
- Clone the project on your local machine
- Navigate to the cloned project directory and run `node server` <br>
    This will wip up an `Express` dev server
- That's about it, get hackin'!

<br>

## Application controls
- Currently the application supports full functionality using the keyboard arrow keys, and partial functionality using the mouse. <br>
    You have the ability to select an option, then control further using the arrow keys, or the mouse (currently with varying freedom)
- You have the option to use hotkeys for every available option:
    - `s` to scale, or click on the `scale` icon
    <br> <img width="40px" src="https://user-images.githubusercontent.com/30023950/95657400-5cc17100-0ae2-11eb-9806-66cb9d206ed9.png" >
    - `v` to move, or click on the `move` icon
    <br> <img width="40px" src="https://user-images.githubusercontent.com/30023950/95657408-5e8b3480-0ae2-11eb-8861-8939258e16cd.png" >
    - `e` to extrude a model, or click on the `extrude` icon
    <br> <img width="40px" src="https://user-images.githubusercontent.com/30023950/95657406-5e8b3480-0ae2-11eb-8de6-bdbc23b8393d.png" >
    - `o` to orbit the camera, or click on the `orbit` icon (toggle-able)
    <br> <img width="40px" src="https://user-images.githubusercontent.com/30023950/95657404-5df29e00-0ae2-11eb-91a3-1673f1f42190.png" >
    - `p` to translate the camera, or click on the `pan` icon
    <br> <img width="40px" src="https://user-images.githubusercontent.com/30023950/95657405-5e8b3480-0ae2-11eb-9853-1cc3d7479d3e.png" >
    - `z` to zoom the camera, or click on the `zoom` icon
    <br> <img width="40px" src="https://user-images.githubusercontent.com/30023950/95657399-5cc17100-0ae2-11eb-8753-ad303def5619.png" >
    - `n` to add a new model, or click on the `new` icon
    <br> <img width="40px" src="https://user-images.githubusercontent.com/30023950/95657403-5d5a0780-0ae2-11eb-9966-eb12acf4c177.png" >
    - `f` to change the current model's style, or click on the `change style` icon
    <br> <img width="40px" src="https://user-images.githubusercontent.com/30023950/95657402-5d5a0780-0ae2-11eb-9d8d-796726357a67.png" >
    - `g` to toggle grid visibility, or click on the `grid` icon
    <br> <img width="40px" src="https://user-images.githubusercontent.com/30023950/95657398-5c28da80-0ae2-11eb-844a-beff08f5dade.png" >
    - `c` to clear the current scene, or click on the `clear` icon
    <br> <img width="40px" src="https://user-images.githubusercontent.com/30023950/95657401-5d5a0780-0ae2-11eb-885c-39677f542960.png" >

<br>

## Tech Used
- Languages used:
    - Javascript
    - GLSL
    - HTML/CSS
- Libraries/APIs used:
    - Express.js
    - WebGL
