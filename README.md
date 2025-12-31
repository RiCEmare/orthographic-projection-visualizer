# Orthographic Projection Visualizer

An interactive web application designed to help engineering students understand **Orthographic Projections** through a dynamic **Virtual 4-Quadrant System** with an **Unfolding Simulation**.

## 🎯 Educational Purpose

Students often struggle to visualize why orthographic views are positioned in a specific arrangement—for example, why the **Top View appears below the Front View** in **First-Angle Projection**. This application addresses this challenge by:

1. **Demonstrating the Unfolding Process**: The Horizontal Plane (HP) rotates mechanically by 90° until it aligns with the Vertical Plane (VP)
2. **Visual Revelation**: Shows how the standard 2D orthographic layout is formed from the 3D projection system
3. **Interactive Learning**: Allows students to control the animation and explore different object shapes

## 🚀 Features

- **Real-time 3D Visualization** using React Three Fiber
- **Unfolding Animation** with precise mathematical transformations
- **Multiple Object Shapes**: Cube, Cylinder, Cone, and Complex shapes
- **Interactive Controls**: Slider-based animation control and visibility toggles
- **Technical Drawing Style**: Uses EdgesGeometry for authentic engineering drawing appearance
- **Debug Panel**: Leva integration for fine-tuning and inspection

## 🛠️ Technology Stack

- **Framework**: React 18+ with Vite
- **Language**: TypeScript (strict mode)
- **3D Engine**: React Three Fiber (R3F) + Three.js
- **UI Library**: @react-three/drei
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Debug Tools**: Leva

## 📐 Technical Implementation

### Orthographic View Generation

Views are generated using **coordinate flattening** rather than auxiliary cameras:

```typescript
// Front View: Scale object [1, 1, 0] - projects onto VP (z=0 plane)
<mesh scale={[1, 1, 0]}>
  <boxGeometry args={[1.5, 1.5, 1.5]} />
  <Edges color="#000000" linewidth={2} />
</mesh>

// Top View: Scale object [1, 0, 1] - projects onto HP (y=0 plane)
<mesh scale={[1, 0, 1]}>
  <boxGeometry args={[1.5, 1.5, 1.5]} />
  <Edges color="#000000" linewidth={2} />
</mesh>
```

### Unfolding Mathematics

The unfolding animation rotates the entire HP group around the X-axis:

```typescript
// Initial rotation: -π/2 (horizontal, normal pointing up)
// Final rotation: 0 (vertical, aligned with VP)
const rotationX = -Math.PI / 2 + (unfoldProgress * Math.PI / 2);
```

### Critical Design Rules

1. ✅ **Top View is inside HP group** - Never animated independently
2. ✅ **Coordinate flattening** - No auxiliary cameras
3. ✅ **EdgesGeometry rendering** - Technical drawing style
4. ✅ **Group-based rotation** - Entire HP rotates with Top View

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎮 Usage

1. **Select Object Shape**: Choose from Cube, Cylinder, Cone, or Complex shapes
2. **Control Unfolding**: 
   - Use the slider to manually control the unfolding process
   - Click "Animate" for automatic unfolding animation
   - Click "Reset" to return to initial state
3. **Toggle Visibility**: Show/hide different elements to focus on specific aspects
4. **Camera Control**: Use mouse to rotate, zoom, and pan the 3D view
5. **Debug Panel**: Use Leva controls (top-right) for fine-tuning

## 📚 Project Structure

```
src/
├── components/
│   ├── Object3D.tsx              # Main 3D object (cube, cylinder, etc.)
│   ├── FrontViewProjection.tsx   # Front view using coordinate flattening
│   ├── TopViewProjection.tsx     # Top view using coordinate flattening
│   ├── VerticalPlane.tsx         # VP (red plane - "wall")
│   ├── HorizontalPlane.tsx       # HP (blue plane - "floor") with unfolding
│   ├── UIControls.tsx            # Main user interface panel
│   └── DebugPanel.tsx            # Leva debug controls
├── store/
│   └── useStore.ts               # Zustand state management
├── App.tsx                       # Main application component
├── main.tsx                      # Application entry point
└── index.css                     # Global styles
```

## 🎓 Educational Concepts

### First-Angle Projection

This application demonstrates **First-Angle Projection**, where:
- The object is placed in the **first quadrant** (above HP, in front of VP)
- The **Top View** appears **below** the Front View in the final 2D layout
- The unfolding simulation reveals why this arrangement occurs

### Key Learning Points

1. **3D to 2D Transformation**: How 3D objects are represented in 2D views
2. **Plane Alignment**: Why and how projection planes align
3. **View Positioning**: The geometric reasoning behind view placement
4. **Orthographic Principles**: Parallel projection and true dimensions

## 🔧 Configuration

### Adjusting Animation Speed

Modify the duration in `src/components/UIControls.tsx`:

```typescript
const duration = 2000; // milliseconds
```

### Changing Object Position

Modify positions in `src/components/Object3D.tsx`:

```typescript
const position: [number, number, number] = [0, 1.5, 1.5];
```

### Customizing Plane Appearance

Modify colors and opacity in `src/components/VerticalPlane.tsx` and `src/components/HorizontalPlane.tsx`

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows TypeScript strict mode
- Components are well-documented
- Mathematical transformations are explained
- Educational value is maintained

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built for engineering education to improve spatial visualization and orthographic projection understanding.

---

**Made with ❤️ for Engineering Students**
