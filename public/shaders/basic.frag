precision highp float;

const vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));

varying vec3 vColor;
varying vec3 vNormal;
varying mat4 normalMtxOut;


void main() 
{
    vec4 diffuse = vec4(1.0, 1.0, 1.0, 1.0) * max(dot(vNormal, lightDir), 0.0);
    vec4 transformedNormal = normalMtxOut * vec4(vNormal, 1.0);
    float directional = max(dot(transformedNormal.xyz, lightDir), 0.0);
    vec3 ambient = vec3(0.3, 0.3, 0.3);
    vec3 vLighting = ambient + (directional * vec3(1, 1, 1));
    gl_FragColor = vec4(vColor * vLighting, 1);
}