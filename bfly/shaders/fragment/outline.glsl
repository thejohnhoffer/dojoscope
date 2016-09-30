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



vec4 colormap (vec4 val) {

  int n = 1;
  int tot = 6000;
  int did = unpack(val);
  vec3 lo = vec3(0,0,0);
  vec3 hi = vec3(1,1,0);
  vec3 done = vec3(1);
  if (did < tot){
      done = mix(lo,hi,float(did)/float(tot));
  }
  return vec4(done,1);
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
  for (int n = 0; n < 10; n++){
      vec2 square = vec2(n, 0);
      vec4 winning = offset(square);
      if(!equals4(here_id,winning)){
          return colormap(abs(winning-here_id));
      }
  }

  return vec4(1,1,1,1);
}

void main() {
  gl_FragColor = borders();
}