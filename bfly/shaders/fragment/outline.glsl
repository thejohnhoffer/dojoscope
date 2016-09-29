precision highp float;
uniform sampler2D u_tile;
uniform vec2 u_tile_size;
varying vec2 v_tile_pos;

//
// FLOAT COMPARE FUNCTIONS WITH DELTA
//
bool equals4(vec4 id1, vec4 id2) {
  return all(equal(id1,id2));
}

// rgba to one 32 bit int
int unpack (vec4 value) {
  ivec4 id = ivec4(value*255.);
  return id.x + 256*id.y + 65536*id.z + 16777216*id.w;
}

vec4 hsv2rgb(vec3 c, float a) {
  vec4 K = vec4(1., 2./3., 1./3., 3.);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6. - K.www);
  vec3 done = c.z * mix(K.xxx, clamp(p - K.xxx, 0., 1.), c.y);
  return vec4(done,a);
}

vec3 spike(vec3 id, vec3 k) {
    vec3 step = mod(id, k.x)/k.x + mod(id, k.y)/k.y + mod(id, k.z)/k.z;
    return mod(step,1.5)/1.5;
}

vec4 colormap (vec4 val) {
  vec3 k = vec3(1./97.,1./47.,1.);
  float offset = dot(k,vec3(1./3.));
  vec3 off = vec3(0, offset, -offset);
  vec3 id = vec3(val.x)+off;
  vec3 maxs = vec3(1, 1,.9);
  vec3 mins = vec3(0,.8,.3);

  vec3 hsv = clamp(spike(id,k),mins,maxs);
  return hsv2rgb(hsv,1.);
}

//
// calculate the color of sampler at an offset from position
//
vec4 offset(vec2 off) {
  // calculate the color of sampler at an offset from position
  return texture2D(u_tile, v_tile_pos + off*u_tile_size);
}

//
// Check whether nearby positions are the same
//
vec4 borders() {
  vec4 here_id = offset(vec2(0, 0));
  // Borders if any corner not shared
  for (int n = 0; n < 4; n++){
      float even = mod(float(n),2.);
      vec2 square = vec2(!(n > 1),(n > 1))*even;
      if(!equals4(here_id, offset(square))){
          return vec4(0.,0.,0.,1.);
      }
  }
  return colormap(here_id);
}

void main() {
  gl_FragColor = borders();
}