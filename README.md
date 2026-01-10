# Orthographic Projection Visualizer

An interactive web application designed to help engineering students understand **Orthographic Projections** through a dynamic **4-Plane System** with an **Unfolding Simulation**. Supports both **First-Angle** and **Third-Angle** projection systems.

## 🎯 Educational Purpose

Students often struggle to visualize why orthographic views are positioned in a specific arrangement—for example, why the **Top View appears below the Front View** in **First-Angle Projection** but above in **Third-Angle Projection**. This application addresses this challenge by:

1. **Demonstrating the Unfolding Process**: Multiple planes (Horizontal, Vertical, and Profile Planes) rotate mechanically by 90° until they align into a 2D layout
2. **Visual Revelation**: Shows how the standard 2D orthographic layout is formed from the 3D projection system
3. **Interactive Learning**: Allows students to control the animation, switch between projection types, and explore different object shapes
4. **Multi-View Projection**: Demonstrates Front, Top, Right Side, and Left Side views simultaneously

## 🚀 Features

- **Dual Projection Systems**: First-Angle and Third-Angle projection support
- **Real-time 3D Visualization** using React Three Fiber
- **Four Projection Planes**: Vertical Plane (VP), Horizontal Plane (HP), Right Profile Plane (PP), and Left Profile Plane
- **Advanced Projection Rendering**: Edge-based projection with hidden line detection using raycasting
- **Unfolding Animation** with precise mathematical transformations for all planes
- **Multiple Object Shapes**: Cube, Cylinder, Cone, and Complex (merged Box+Cylinder)
- **Guided Workflow**: Step-by-step shape selection, projection type selection, and view drawing
- **Interactive Controls**: Slider-based animation control, view visibility toggles, and plane highlighting
- **Plane Highlighting**: Visual feedback with pulsing yellow highlights for active projection planes

## 🛠️ Technology Stack

- **Framework**: React 19 with Vite 7
- **Language**: TypeScript 5.9+ (strict mode)
- **3D Engine**: React Three Fiber (R3F) + Three.js
- **UI Library**: @react-three/drei
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **Additional Libraries**: Leva (debug controls)

## 📐 Technical Implementation

### Orthographic View Generation

Views are generated using **vertex projection and raycasting** through the `ProjectionRenderer` component:

**Projection Mechanism:**
1. Creates geometric representation of the 3D object
2. Extracts all edges from the geometry
3. Projects vertices onto the target plane using orthographic projection (dropping one coordinate axis)
4. Uses raycasting to detect occlusion and identify hidden lines
5. Renders visible edges as solid black lines, hidden edges as dashed gray lines

**Projection Mathematics:**
```typescript
// Front View (VP): Project onto Z=0 plane, drop Z coordinate
function projectVertex(vertex: THREE.Vector3, dropAxis: 'z'): THREE.Vector3 {
  const projected = vertex.clone();
  projected.z = 0;
  return projected;
}

// Top View (HP): Project onto Y=0 plane, drop Y coordinate
// Side View (PP): Project onto X=0 plane, drop X coordinate
```

### Multi-Plane Unfolding System

The application uses **three separate unfolding rotations**:

**1. Horizontal Plane (HP) - Top View**
```typescript
// Rotates around X-axis from horizontal to vertical
const initialRotation = -Math.PI / 2;
const rotationX = initialRotation + unfoldProgress * -initialRotation;
groupRef.current.rotation.x = rotationX;
// Both First and Third Angle: -π/2 → 0
```

**2. Right Profile Plane (PP) - Right Side View**
```typescript
// Rotates around Y-axis, direction depends on projection type
const initialRotation = projectionType === "first-angle" ? -Math.PI / 2 : Math.PI / 2;
const rotationY = initialRotation - unfoldProgress * initialRotation;
pivotGroupRef.current.rotation.y = rotationY;
// First Angle: -π/2 → 0 (plane on right, rotates left)
// Third Angle: π/2 → 0 (plane on right, rotates right)
```

**3. Left Profile Plane (PP) - Left Side View**
```typescript
// Similar to Right Profile Plane but mirrored
// First Angle: π/2 → 0 (plane on left, rotates right)
// Third Angle: -π/2 → 0 (plane on left, rotates left)
```

### Object Positioning

Object position depends on projection type:
```typescript
const objectPos = projectionType === "first-angle"
  ? new THREE.Vector3(0, 2, 2)   // First Angle: +Y, +Z (above VP, in front of HP)
  : new THREE.Vector3(0, -2, -2); // Third Angle: -Y, -Z (below VP, behind HP)
```

### Critical Design Patterns

1. ✅ **Projection views inside plane groups** - TopViewProjection inside HorizontalPlane group, side views inside their respective Profile Plane groups
2. ✅ **Vertex-based projection** - Uses actual vertex projection with axis dropping, not camera tricks or scaling
3. ✅ **Hidden line detection** - Raycasting determines visible vs. hidden edges
4. ✅ **Group-based rotation** - Entire plane groups rotate with their projections intact
5. ✅ **Dual projection support** - Object position and plane rotations adapt to projection type
6. ✅ **Plane highlighting** - Pulsing animation provides visual feedback for active drawing planes

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
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

### Workflow Steps

1. **Shape Selection**: Choose from Cube, Cylinder, Cone, or Complex shapes
2. **Projection Type**: Select First-Angle or Third-Angle projection
3. **Drawing Phase**: 
   - Click "Draw Front View" to project onto the Vertical Plane
   - Click "Draw Top View" to project onto the Horizontal Plane
   - Click "Draw Right Side View" to project onto the Right Profile Plane
   - Click "Draw Left Side View" to project onto the Left Profile Plane
4. **Unfolding Phase**: 
   - Use the slider to manually control the unfolding process
   - Click "Animate Unfolding" for automatic unfolding animation
   - Click "Reset" to return to initial state

### Additional Controls

- **Toggle Visibility**: Show/hide individual projections (Front, Top, Right Side, Left Side views)
- **Camera Control**: Use mouse to orbit, zoom, and pan the 3D scene (OrbitControls enabled)
- **Plane Highlighting**: Active drawing planes pulse with yellow highlights for visual feedback

## 📚 Project Structure

```
src/
├── components/
│   ├── Object3D.tsx                 # Main 3D object (renders selected shape)
│   ├── ProjectionRenderer.tsx       # Advanced projection with raycasting & hidden lines
│   ├── FrontViewProjection.tsx      # Front view projection (uses ProjectionRenderer)
│   ├── TopViewProjection.tsx        # Top view projection (uses ProjectionRenderer)
│   ├── RightSideViewProjection.tsx  # Right side view projection
│   ├── LeftSideViewProjection.tsx   # Left side view projection
│   ├── VerticalPlane.tsx            # VP (red plane, fixed position)
│   ├── HorizontalPlane.tsx          # HP (blue plane) with unfolding rotation
│   ├── RightProfilePlane.tsx        # Right PP (green plane) with unfolding rotation
│   ├── LeftProfilePlane.tsx         # Left PP (green plane) with unfolding rotation
│   ├── UIControls.tsx               # Main user interface panel (Tailwind CSS)
│   ├── CameraAnimation.tsx          # Automatic camera positioning system
│   ├── CameraTracker.tsx            # Camera position/rotation tracking
│   ├── PlaneIndicator.tsx           # Visual indicator for active plane
│   └── ViewLabels.tsx               # Labels shown at 100% unfold
├── store/
│   └── useStore.ts                  # Zustand state management (all app state)
├── App.tsx                          # Main application component
├── main.tsx                         # Application entry point
└── index.css                        # Global styles
```

## 🎓 Educational Concepts

### First-Angle vs. Third-Angle Projection

The application demonstrates both projection systems:

**First-Angle Projection:**
- Object positioned at (0, 2, 2) - above HP and in front of VP
- **Top View** appears **below** the Front View in final 2D layout
- **Right Side View** appears on the **left** of the Front View
- Commonly used in Europe and Asia

**Third-Angle Projection:**
- Object positioned at (0, -2, -2) - below HP and behind VP
- **Top View** appears **above** the Front View in final 2D layout
- **Right Side View** appears on the **right** of the Front View
- Commonly used in North America

### Key Learning Points

1. **3D to 2D Transformation**: How 3D objects are represented in 2D orthographic views using vertex projection
2. **Plane Unfolding**: Why and how projection planes rotate and align to form the standard 2D layout
3. **View Positioning**: The geometric reasoning behind view placement in both projection systems
4. **Orthographic Principles**: Parallel projection preserves true dimensions
5. **Hidden Line Removal**: Understanding visible vs. hidden edges through occlusion detection

## 🔧 Configuration

### Adjusting Animation Speed

Modify the duration in [UIControls.tsx](src/components/UIControls.tsx):

```typescript
const duration = 2000; // milliseconds (in handleAnimate function)
```

### Changing Object Position

Object position is automatically calculated based on projection type in [ProjectionRenderer.tsx](src/components/ProjectionRenderer.tsx):

```typescript
const objectPos = useMemo(() => {
  return projectionType === "first-angle"
    ? new THREE.Vector3(0, 2, 2)
    : new THREE.Vector3(0, -2, -2);
}, [projectionType]);
```

### Customizing Plane Appearance

Modify colors and opacity in plane components:
- [VerticalPlane.tsx](src/components/VerticalPlane.tsx) - Red plane (#ff6b6b)
- [HorizontalPlane.tsx](src/components/HorizontalPlane.tsx) - Blue plane (#4a9eff)
- [RightProfilePlane.tsx](src/components/RightProfilePlane.tsx) - Green plane (#90ee90)
- [LeftProfilePlane.tsx](src/components/LeftProfilePlane.tsx) - Green plane (#90ee90)

### Adding New Object Shapes

Add new shapes to [ProjectionRenderer.tsx](src/components/ProjectionRenderer.tsx) geometry creation:

```typescript
const geometry = useMemo(() => {
  switch (objectShape) {
    case "your-shape":
      return new THREE.YourGeometry(...);
    // ... existing cases
  }
}, [objectShape]);
```

Then update the type in [useStore.ts](src/store/useStore.ts):

```typescript
objectShape: "cube" | "cylinder" | "cone" | "complex" | "your-shape";
```

## 🎯 State Management

The application uses Zustand for centralized state management. Key state variables:

- `unfoldProgress`: Controls plane unfolding animation (0 to 1)
- `projectionType`: Switches between "first-angle" and "third-angle"
- `objectShape`: Currently selected shape
- `workflowStep`: Manages guided workflow progression
- `showFrontView`, `showTopView`, `showSideView`, `showLeftSideView`: Visibility toggles
- `highlightedPlane`: Controls which plane receives pulsing highlight
- `frontDrawn`, `topDrawn`, `sideDrawn`, `leftSideDrawn`: Tracks drawing completion

## 🐛 Troubleshooting

### Projections Not Appearing
- Ensure projection visibility toggles are enabled
- Check that drawing phase is completed for the desired view
- Verify object shape is selected

### Animation Not Working
- Check that `isAnimating` state is properly toggled
- Ensure `unfoldProgress` is updating (0 to 1 range)
- Verify plane rotation calculations in plane components

### Hidden Lines Not Rendering
- Raycasting requires proper geometry normals
- Check that object position matches projection type
- Verify projection direction vectors in `ProjectionRenderer.tsx`

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows TypeScript strict mode guidelines
- Components are well-documented with implementation notes
- Mathematical transformations are clearly explained
- Educational value is preserved and enhanced
- Both First-Angle and Third-Angle projections are tested

## 📄 License

This project is open source and available for educational use.

## 🙏 Acknowledgments

Built for engineering education to improve spatial visualization and orthographic projection understanding. Supports international engineering drawing standards (ISO 128, ASME Y14.3).

---

**Made with ❤️ for Engineering Students**
