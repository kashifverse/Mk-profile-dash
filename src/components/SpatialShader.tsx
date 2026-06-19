import { useEffect, useRef } from "react";

export default function SpatialShader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext;
    } catch (e) {
      console.warn("WebGL not supported in this frame", e);
    }

    if (!gl) {
      // Fallback if WebGL isn't supported in standard iframe sandbox
      return;
    }

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      void main() {
        vec2 uv = v_texCoord;
        vec2 m = u_mouse / u_resolution;
        
        // Create a dark, subtle spatial grid/web effect
        float line = 0.0;
        
        // Animated grid lines
        vec2 grid = fract(uv * 15.0 + u_time * 0.03);
        line += smoothstep(0.02, 0.0, grid.x) * 0.12;
        line += smoothstep(0.02, 0.0, grid.y) * 0.12;
        
        // Floating "data points" or stars
        vec2 p = fract(uv * 30.0 + sin(u_time * 0.1));
        float point = smoothstep(0.08, 0.0, length(p - 0.5)) * 0.25;
        
        // Background color (Deep Black #0D0D0D)
        vec3 color = vec3(0.051, 0.051, 0.051);
        
        // Add primary highlight (Luxurious gold #C5A059) and accents
        vec3 accent = vec3(0.7725, 0.6274, 0.349); // #C5A059
        vec3 bronze = vec3(0.35, 0.28, 0.16); // subtle bronze-gold
        
        // Subtle mouse interaction glow
        float dist = length(uv - m);
        float glow = smoothstep(0.5, 0.0, dist) * 0.18;
        
        color += accent * line;
        color += bronze * point;
        color += accent * glow;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function loadShader(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders: " + gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) return;

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
      return;
    }

    gl.useProgram(shaderProgram);

    // Buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const uTimeLocation = gl.getUniformLocation(shaderProgram, "u_time");
    const uResolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
    const uMouseLocation = gl.getUniformLocation(shaderProgram, "u_mouse");

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouseX = nx * canvas.width;
        mouseY = ny * canvas.height;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Dynamic sizing via ResizeObserver
    const syncSize = () => {
      const container = containerRef.current;
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => syncSize());
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
    }
    syncSize();

    let animationFrameId: number;
    const render = (time: number) => {
      if (!gl || !canvas) return;
      syncSize();

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(shaderProgram);

      if (uTimeLocation) gl.uniform1f(uTimeLocation, time * 0.001);
      if (uResolutionLocation) gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);
      if (uMouseLocation) gl.uniform2f(uMouseLocation, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <canvas ref={canvasRef} className="block w-full h-full opacity-60" />
      {/* Fallback solid grid in case browser canvas sandbox suppresses WebGL */}
      <div 
        className="absolute inset-0 bg-[#0D0D0D] spatial-grid opacity-30 z-[-1]" 
        style={{
          backgroundImage: "linear-gradient(to right, rgba(197, 160, 89, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(197, 160, 89, 0.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }}
      />
    </div>
  );
}
