# 3D Landing Page – Shopify Design Inspired

A premium, interactive 3D landing page built with React, Three.js, and modern web technologies. This project transforms a simple website into an immersive 3D experience inspired by the aesthetic of [shopify.design](https://shopify.design).

## Features

- **Full‑screen 3D Canvas** – Powered by `@react-three/fiber` and `@react-three/drei`
- **Procedural 3D Shapes** – Icosahedron, Torus Knot, and Sphere with glass‑like `MeshPhysicalMaterial`
- **Dynamic Lighting** – Ambient, directional, and mouse‑following point light
- **Parallax Interaction** – 3D shapes subtly respond to mouse movement
- **UI Overlay** – Minimalist, bold typography with smooth animations (Framer Motion)
- **Responsive Design** – Tailwind CSS for adaptive layout
- **Performance Optimized** – 60fps animations, efficient WebGL rendering

## Tech Stack

- **React 18** + **Vite** – Fast development and build tooling
- **Three.js** + **React Three Fiber** – 3D rendering library
- **React Three Drei** – Useful helpers and environment maps
- **Tailwind CSS** – Utility‑first CSS framework
- **Framer Motion** – Smooth UI animations
- **GSAP** (optional) – Advanced timeline animations

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm installed

### Installation

1. Clone the repository or navigate to the `frontend` folder.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Scene.jsx          # 3D scene with shapes and lighting
│   │   ├── MouseLight.jsx     # Mouse‑following point light
│   │   ├── Navbar.jsx         # Top navigation bar
│   │   ├── Hero.jsx           # Central hero section
│   │   └── ScrollIndicator.jsx # Animated scroll indicator
│   ├── App.jsx                # Main app layout (Canvas + UI overlay)
│   ├── main.jsx               # React entry point
│   └── index.css              # Tailwind styles and global CSS
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Customization

### 3D Shapes

Edit `src/components/Scene.jsx` to change geometries, materials, positions, or colors.

### UI Content

Modify the text and styles in `Navbar.jsx`, `Hero.jsx`, and `ScrollIndicator.jsx`.

### Colors & Themes

Update the color palette in `tailwind.config.js` and `src/index.css`.

### Lighting

Adjust light positions, intensities, and colors in `Scene.jsx` and `MouseLight.jsx`.

## Performance Notes

- The 3D scene uses `MeshPhysicalMaterial` with transmission (glass effect) which can be GPU‑intensive. Ensure your target devices support WebGL 2.
- For lower‑end devices, consider reducing geometry detail (`IcosahedronGeometry` subdivisions) or disabling shadows.
- Use `useMemo` for geometries and materials if adding many objects.

## Browser Support

- Modern browsers with WebGL 2 support (Chrome 90+, Firefox 88+, Safari 15+)
- Falls back to a static gradient background if WebGL is unavailable (to be implemented)

## License

MIT

## Acknowledgments

- Inspired by the design language of [Shopify Design](https://shopify.design)
- Built with [React Three Fiber](https://github.com/pmndrs/react-three-fiber) and [Drei](https://github.com/pmndrs/drei)
- Fonts from [Google Fonts](https://fonts.google.com)