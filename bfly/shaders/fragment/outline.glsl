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
float unpack (vec4 value) {
  return dot(value.abgr, pow(vec4(256.),vec4(3., 2., 1., 0.)));
}

vec4 colormap (float rad) {
  vec4 answer = vec4(1.);
  for (int n = 0; n < 3; n++) {
      float k = pow(2.,float(8+n));
      answer[n] = (1. + sin(k*rad))/2.;
  }
  return answer;
}

//
// calculate the color of sampler at an offset from position
//
vec4 offset(sampler2D sam, vec2 pos, vec2 off) {
  // calculate the color of sampler at an offset from position
  return texture2D(sam, vec2(pos.x + off.x/u_tile_size.x, pos.y + off.y/u_tile_size.y));
}

//
// Check whether nearby positions are the same
//
vec4 borders(sampler2D sam, vec2 pos) {
  // calculate the color of sampler at an offset from position
  vec4 here_id = offset(sam,pos,vec2(0., 0.));

  bool left = equals4(here_id, offset(sam,pos,vec2(-1., 0.)));
  bool right = equals4(here_id, offset(sam,pos,vec2(1., 0.)));
  bool down = equals4(here_id, offset(sam,pos,vec2(0., -1.)));
  bool top = equals4(here_id, offset(sam,pos,vec2(0., 1.)));

  // If any are false, return false TODO: optimize
  if (!left || !right || !down || !top) {
    return vec4(0.,0.,0.,1.);
  }
  return colormap(unpack(here_id));
}


void main() {
  gl_FragColor = borders(u_tile, v_tile_pos);
}