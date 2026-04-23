# 3D Website Transformation Prompt

Transform a simple website into a 3D‑rich, immersive experience inspired by Shopify Design (https://shopify.design). This prompt provides detailed instructions for an AI (like ChatGPT) or a developer to implement a 3D‑first redesign.

## Core Principles

1. **Depth & Perspective** – Use 3D transforms, parallax scrolling, and layered elements to create a sense of depth.
2. **Material Design** – Apply realistic materials (glass, metal, soft shadows) with subtle lighting.
3. **Interactive 3D** – Incorporate WebGL/Three.js for interactive 3D objects that respond to cursor movement.
4. **Smooth Animations** – All transitions should be fluid, using spring‑based or physics‑based motion.
5. **Immersive UI** – UI components (buttons, cards, panels) should feel like physical objects in a 3D space.

## Visual Style

### Color Palette
- **Background**: Dark gradient (`#0a0a0f` to `#1a1a2e`)
- **Primary**: Electric blue (`#00d4ff`), purple (`#7c3aed`)
- **Surface**: Semi‑transparent glass (`rgba(255,255,255,0.05)` with backdrop‑blur)
- **Accent**: Neon green (`#00ff88`), warm orange (`#ff6b35`)

### Lighting
- Simulate a directional light source from the top‑left.
- Add ambient occlusion (soft shadows) between layered elements.
- Use `box‑shadow` with multiple layers to simulate depth.

### Typography
- **Headings**: Bold, sans‑serif (e.g., `'Sora', sans‑serif`) with subtle 3D extrusion.
- **Body**: Clean, readable type with adequate line‑height.

## Technical Implementation

### 1. Enable 3D Canvas
- Include Three.js (r128+) and Tween.js for animations.
- Create a WebGL renderer that covers the entire viewport as a background layer.
- Add a particle system or floating geometric shapes that react to mouse movement.

### 2. Convert Flat UI to 3D
- **Buttons**: Use `transform: translateZ()` and `box‑shadow` to make them appear raised. On hover, elevate further and add a glow.
- **Cards**: Apply `rotateX(‑2deg) rotateY(2deg)` and a depth‑shadow. Animate on hover with a gentle “lift” effect.
- **Navigation**: Sticky navbar with a glass‑morphism background and a subtle 3D border.

### 3. Parallax Scrolling
- Divide content into layers (background, mid‑ground, foreground).
- Move layers at different speeds during scroll using `data‑speed` attributes.
- Use `IntersectionObserver` to trigger entrance animations.

### 4. Interactive 3D Elements
- **Floating 3D Logo**: A rotating 3D model of the site’s logo (using Three.js).
- **Hover‑activated 3D previews**: When hovering over a product/image, show a 3D rotation of the item.
- **3D Data Visualization**: Replace 2D charts with 3D bar charts or interactive graphs.

### 5. Advanced Effects
- **Mouse‑tracking spotlight**: A light that follows the cursor, highlighting UI elements.
- **Depth‑of‑field blur**: Elements farther from the focal point are slightly blurred.
- **Real‑time reflections**: On glossy surfaces, reflect the surrounding environment.

## Step‑by‑Step Transformation Guide

### A. HTML Structure
Wrap the entire page in a 3D context:
```html
<div id="three‑container">
  <div class="layer background‑layer"></div>
  <div class="layer content‑layer">
    <!-- Your existing content goes here -->
  </div>
  <div class="layer foreground‑layer"></div>
</div>
```

### B. CSS 3D Enhancements
Add to your stylesheet:
```css
/* Enable 3D perspective on the root */
html {
  perspective: 1000px;
  overflow‑x: hidden;
}

/* Glass‑morphism panel */
.glass‑panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop‑filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border‑radius: 20px;
  box‑shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateZ(20px);
  transition: transform 0.4s cubic‑bezier(0.175, 0.885, 0.32, 1.275);
}

.glass‑panel:hover {
  transform: translateZ(40px);
}

/* 3D button */
.btn‑3d {
  background: linear‑gradient(135deg, #00d4ff, #7c3aed);
  border: none;
  padding: 14px 28px;
  border‑radius: 12px;
  color: white;
  font‑weight: 700;
  cursor: pointer;
  transform: translateZ(0);
  box‑shadow: 
    0 5px 15px rgba(0, 212, 255, 0.4),
    0 10px 30px rgba(124, 58, 237, 0.3);
  transition: all 0.3s;
}

.btn‑3d:hover {
  transform: translateZ(10px);
  box‑shadow: 
    0 10px 25px rgba(0, 212, 255, 0.6),
    0 20px 40px rgba(124, 58, 237, 0.5);
}
```

### C. JavaScript – Three.js Integration
Initialize a 3D scene that runs in the background:
```javascript
// Create scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.prepend(renderer.domElement);
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '‑1';
renderer.domElement.style.pointerEvents = 'none';

// Add floating geometry
const geometry = new THREE.IcosahedronGeometry(1, 0);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Mouse interaction
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 ‑ 1;
  mouseY = ‑ (e.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;
  mesh.position.x = mouseX * 2;
  mesh.position.y = mouseY * 2;
  renderer.render(scene, camera);
}
animate();
```

### D. Parallax Implementation
```javascript
document.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const background = document.querySelector('.background‑layer');
  const content = document.querySelector('.content‑layer');
  const foreground = document.querySelector('.foreground‑layer');
  
  background.style.transform = `translateY(${scrolled * 0.5}px)`;
  content.style.transform = `translateY(${scrolled * 0.2}px)`;
  foreground.style.transform = `translateY(${scrolled * 0.1}px)`;
});
```

## Example Transformation for a Habit‑Tracker Website

Given the existing `tracker_new (1).html` file, apply these changes:

1. **Wrap the whole dashboard** in a 3D container.
2. **Replace flat boxes** with `glass‑panel` styling.
3. **Enhance the existing 3D matrix** – make it the default view, improve lighting, add mouse‑interaction.
4. **Add a floating 3D background** of rotating polyhedrons.
5. **Implement parallax** on the day‑strip and chart areas.
6. **Upgrade buttons** to 3D buttons with hover effects.

## Deliverables

- A single HTML file with all 3D enhancements integrated.
- A separate CSS file for 3D styles (or embedded).
- A JavaScript file containing Three.js setup and interaction logic.
- Instructions for further customization.

## Testing

- Ensure performance is acceptable (60fps).
- Verify that 3D effects work on mobile (fallback to 2D if needed).
- Check browser compatibility (Chrome, Firefox, Safari).

---

**Use this prompt with an AI assistant** to generate the complete code, or follow the steps manually to transform your website into a 3D‑first experience.