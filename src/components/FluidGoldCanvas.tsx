import { useEffect, useRef } from "react";

const FluidGoldCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const scrollSpeedRef = useRef(0);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Coordinates normalized to half-res canvas
      targetMouseRef.current = {
        x: e.clientX / 2,
        y: (window.innerHeight - e.clientY) / 2, // Flip Y for WebGL
      };
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollYRef.current;
      // Add scroll impulse
      scrollSpeedRef.current += diff * 0.45;
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.warn("WebGL not supported, falling back to CSS background.");
      return;
    }

    // Set low-res canvas buffer dimensions for optimal GPU performance
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth / 2);
      canvas.height = Math.floor(window.innerHeight / 2);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // Vertex shader
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader: Liquid Gold Domain Warping with Scroll Speed Dynamics
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_scroll_speed;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(in vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(hash(i + vec2(0.0,0.0)), 
                       hash(i + vec2(1.0,0.0)), u.x),
                   mix(hash(i + vec2(0.0,1.0)), 
                       hash(i + vec2(1.0,1.0)), u.x), u.y);
      }

      float fbm(in vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        // Rotate coordinates to reduce grid alignment artifacts
        mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
        for (int i = 0; i < 4; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        
        // Correct aspect ratio
        float aspect = u_resolution.x / u_resolution.y;
        st.x *= aspect;
        
        vec2 m = u_mouse / u_resolution.xy;
        m.x *= aspect;

        float dist = distance(st, m);

        // Domain warping FBM calculation
        vec2 q = vec2(0.0);
        q.x = fbm(st + 0.05 * u_time);
        q.y = fbm(st + vec2(1.0));

        vec2 r = vec2(0.0);
        
        // Warp coordinates near cursor position + apply scroll speed dynamics
        float force = smoothstep(0.38, 0.0, dist) * 0.18;
        vec2 dir = st - m;
        
        // Scroll speed deformation (vertical offset + wavy side-shifting)
        float scrollOffset = u_scroll_speed * 0.0035;
        vec2 scrollWarp = vec2(sin(st.x * 5.0 + u_time) * scrollOffset * 0.4, scrollOffset);
        
        r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.04 * u_time + dir * force + scrollWarp.x);
        r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.03 * u_time - scrollWarp.y);

        float f = fbm(st + r);

        // Color palette mappings (Obsidian Dark to Liquid Gold)
        vec3 col_obsidian = vec3(0.03, 0.02, 0.015);
        vec3 col_darkgold = vec3(0.48, 0.35, 0.12);
        vec3 col_brightgold = vec3(0.96, 0.82, 0.44);

        vec3 color = mix(col_obsidian, col_darkgold, f);
        color = mix(color, col_brightgold, clamp(length(r.x), 0.0, 1.0) * 0.32);

        // Specular glow highlight at cursor position
        if (dist < 0.28) {
          float glow = pow(1.0 - (dist / 0.28), 2.5) * 0.12;
          color += col_brightgold * glow;
        }

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Shader compiler helper
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Geometry buffer (full screen quad)
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const scrollSpeedLocation = gl.getUniformLocation(program, "u_scroll_speed");

    let animationId = 0;
    const startTime = Date.now();

    // Loop
    const renderLoop = () => {
      // Add inertia to mouse movement for smooth liquid physics
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.08;

      // Slowly damp the scroll speed impulse back to 0
      scrollSpeedRef.current += (0 - scrollSpeedRef.current) * 0.06;

      const elapsed = (Date.now() - startTime) / 1000;

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform1f(scrollSpeedLocation, scrollSpeedRef.current);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen -z-30 pointer-events-none block select-none bg-[#050403]"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default FluidGoldCanvas;

