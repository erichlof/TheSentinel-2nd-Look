precision highp float;
precision highp int;
precision highp sampler2D;

uniform bool uSceneIsDynamic;
uniform bool uUseToneMapping;
uniform float uOneOverSampleCounter;
uniform sampler2D tPathTracedImageTexture;


void main()
{
        vec4 m[9];
        m[0] = texelFetch(tPathTracedImageTexture, ivec2(gl_FragCoord.xy + vec2(-1,1)), 0);
        m[1] = texelFetch(tPathTracedImageTexture, ivec2(gl_FragCoord.xy + vec2(0,1)), 0);
        m[2] = texelFetch(tPathTracedImageTexture, ivec2(gl_FragCoord.xy + vec2(1,1)), 0);

        m[3] = texelFetch(tPathTracedImageTexture, ivec2(gl_FragCoord.xy + vec2(-1,0)), 0);
        m[4] = texelFetch(tPathTracedImageTexture, ivec2(gl_FragCoord.xy + vec2(0,0)), 0);
        m[5] = texelFetch(tPathTracedImageTexture, ivec2(gl_FragCoord.xy + vec2(1,0)), 0);

        m[6] = texelFetch(tPathTracedImageTexture, ivec2(gl_FragCoord.xy + vec2(-1,-1)), 0);
        m[7] = texelFetch(tPathTracedImageTexture, ivec2(gl_FragCoord.xy + vec2(0,-1)), 0);
        m[8] = texelFetch(tPathTracedImageTexture, ivec2(gl_FragCoord.xy + vec2(1,-1)), 0);

        vec4 centerPixel = m[4];
        vec3 filteredPixelColor;
	float threshold = 1.0;
        int count = 1;


        // 3x3 kernel (good for half screen resolutions (pixelRatio = 0.5))
        // start with center pixel
	filteredPixelColor = m[4].rgb;

        // search left
        if (m[3].a < threshold)
        {
                filteredPixelColor += m[3].rgb;
                count++; 
        }
        // search right
        if (m[5].a < threshold)
        {
                filteredPixelColor += m[5].rgb;
                count++; 
        }
        // search above
        if (m[1].a < threshold)
        {
                filteredPixelColor += m[1].rgb;
                count++; 
        }
        // search below
        if (m[7].a < threshold)
        {
                filteredPixelColor += m[7].rgb;
                count++; 
        }

        // search upper-left
        if (m[0].a < threshold)
        {
                filteredPixelColor += m[0].rgb;
                count++; 
        }
        // search upper-right
        if (m[2].a < threshold)
        {
                filteredPixelColor += m[2].rgb;
                count++; 
        }
        // search lower-left
        if (m[6].a < threshold)
        {
                filteredPixelColor += m[6].rgb;
                count++; 
        }
        // search lower-right
        if (m[8].a < threshold)
        {
                filteredPixelColor += m[8].rgb;
                count++; 
        }

        filteredPixelColor /= float(count);

        if (centerPixel.a == 1.01)
                filteredPixelColor = mix(filteredPixelColor, centerPixel.rgb, 0.5);

        filteredPixelColor *= uOneOverSampleCounter;

        // apply tone mapping (brings pixel into 0.0-1.0 rgb color range)
        filteredPixelColor = uUseToneMapping ? ReinhardToneMapping(filteredPixelColor) : filteredPixelColor;
        //filteredPixelColor = OptimizedCineonToneMapping(filteredPixelColor);
        //filteredPixelColor = ACESFilmicToneMapping(filteredPixelColor);

        pc_fragColor = clamp(vec4( pow(filteredPixelColor, vec3(0.4545)), 1.0 ), 0.0, 1.0);
}
