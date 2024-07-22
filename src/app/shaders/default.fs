precision highp float;

uniform vec2 iResolution;
uniform sampler2D u_texture;
uniform float iTime;

void main() {
	vec2 uv = gl_FragCoord.xy / iResolution;
	vec2 xy = uv - vec2(.5);
	float col = (sin(iTime + length(xy)*20.) + 1.) / 2.;
	gl_FragColor = texture2D(u_texture, uv + .04 * col * normalize(xy));
	// gl_FragColor = vec4(0.,0.,0., 1.);
}