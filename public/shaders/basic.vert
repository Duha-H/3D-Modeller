precision highp float;

attribute vec3 position;
attribute vec3 color;
attribute vec3 normal;
varying vec3 vColor;
varying vec3 vNormal;

uniform mat4 modelMtx;
uniform mat4 viewMtx;
uniform mat4 projectionMtx;
uniform mat4 normalMtx;
varying mat4 normalMtxOut;


void main() 
{
    vColor = color;
    vNormal = normal;
    normalMtxOut = normalMtx;
    //vec3 worldNormal = (normalMtx * vec4(vNormal, 1.0)).xyz;
    gl_Position = projectionMtx * viewMtx * modelMtx * vec4(position, 1);
}