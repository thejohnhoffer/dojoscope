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
  return int(value.a) +  int(value.b)*256 + int(value.g)*256*256 + int(value.r)*256*256*256;
}

vec3 hsv2rgb(vec3 c) {
//  return c;
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 colormap (vec4 val) {
  float k = 180.;
  float ival = float(int(val.x));
  float rad = radians(ival);
  float hue = (1.+sin(rad*k))/2.;
  return vec4(hue,hue,hue,1);
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
  float even = 1.0;
  vec4 here_id = offset(vec2(0, 0));
  // Borders if any corner not shared
  for (int n = 0; n < 4; n++){
      vec2 square = vec2(!(n > 1),(n > 1))*even;
      if(!equals4(here_id, offset(square))){
          return vec4(0.,0.,0.,1.);
      }
      even *= -1.0;
  }
  return colormap(here_id);
}

void main() {
  gl_FragColor = borders();
}