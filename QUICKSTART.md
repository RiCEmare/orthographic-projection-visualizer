# Quick Start Guide

## Running the Application

The development server is already running at:
**http://localhost:5173/**

Simply open this URL in your browser to see the application.

## Controls

### Object Selection
- Click on any shape button (Cube, Cylinder, Cone, Complex) to change the 3D object

### Unfolding Animation
- **Slider**: Drag to manually control the unfolding progress (0% to 100%)
- **Animate Button**: Click to see automatic unfolding animation
- **Reset Button**: Return to initial state (0%)

### Visibility Toggles
- **3D Object**: Show/hide the main 3D object
- **Front View**: Show/hide the front orthographic projection
- **Top View**: Show/hide the top orthographic projection
- **Vertical Plane (VP)**: Show/hide the red vertical plane
- **Horizontal Plane (HP)**: Show/hide the blue horizontal plane
- **Grid**: Show/hide the reference grid

### Camera Controls
- **Rotate**: Left-click and drag
- **Pan**: Right-click and drag
- **Zoom**: Scroll wheel

### Debug Panel (Top-Right Corner)
- Use Leva controls for fine-tuning
- Access advanced animation parameters
- Inspect real-time state values

## Educational Usage

1. **Start with everything visible** to see the complete system
2. **Gradually unfold** the HP using the slider to understand the transformation
3. **Toggle visibility** to focus on specific elements
4. **Try different shapes** to see how projections change
5. **Use the animate button** for demonstrations

## Key Learning Points

- Watch how the **blue Horizontal Plane rotates 90°**
- Notice the **Top View moves with the HP**
- Observe why the **Top View ends up below the Front View**
- Compare projections for different shapes

## Troubleshooting

If you don't see the application:
1. Make sure the dev server is running (`npm run dev`)
2. Check that port 5173 is not blocked
3. Clear browser cache and reload
4. Check console for any errors

## Building for Production

```bash
npm run build
npm run preview
```

The production build will be in the `dist/` folder.
