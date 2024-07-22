uniform float u_time;
uniform float u_scale;

varying float vZ;

float hash1( float n )
{
    return fract( n*17.0*fract( n*0.3183099 ) );
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 w = fract(x);
    
    #if 1
    vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    #else
    vec3 u = w*w*(3.0-2.0*w);
    #endif
    
    float n = p.x + 317.0*p.y + 157.0*p.z;
    
    float a = hash1(n+0.0);
    float b = hash1(n+1.0);
    float c = hash1(n+317.0);
    float d = hash1(n+318.0);
    float e = hash1(n+157.0);
	float f = hash1(n+158.0);
    float g = hash1(n+474.0);
    float h = hash1(n+475.0);

    float k0 =   a;
    float k1 =   b - a;
    float k2 =   c - a;
    float k3 =   e - a;
    float k4 =   a - b - c + d;
    float k5 =   a - c - e + g;
    float k6 =   a - b - e + f;
    float k7 = - a + b + c - d + e - f - g + h;

    return -1.0+2.0*(k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z);
}

void main() {
    vec4 pos = modelMatrix * vec4(position, 1.0);
  
//   modelPosition.z += sin(modelPosition.x * 5.0 + u_time * 3.0) * 0.3;
//   modelPosition.z += sin(modelPosition.y * 6.0 + u_time * 2.0) * 0.3;

    // modelPosition.y = 0.;
    float n = 0.;

    for(int i = 0; i < 4; i++){
        float scale = pow(u_scale, float(i));
        n += scale * abs(noise(vec3(pos.xz / scale, u_time)));
    }

    n = .5*(1.-n);

    pos.y = n;
    // pos.y = noise(vec3(pos.xz, u_time));
  
    vZ = n;
    // vZ = phi;

    vec4 viewPosition = viewMatrix * pos;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}
