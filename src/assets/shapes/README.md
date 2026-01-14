# Using STL Files in the Orthographic Projection Visualizer

## Converting .ipt Files to .stl

Your current files in `src/assets/shapes/` are Autodesk Inventor (.ipt) files. To use them in this web application, you need to convert them to STL format.

### Using Autodesk Inventor:

1. Open the .ipt file in Autodesk Inventor
2. Go to **File** → **Save As** → **Save Copy As**
3. In the "Save as type" dropdown, select **STL Files (*.stl)**
4. Click **Options** to configure:
   - **Resolution**: Choose "High" for better quality
   - **Structure**: "Binary" (smaller file size) or "ASCII" (human-readable)
5. Click **OK** and then **Save**
6. Repeat for all PART_*.ipt files

### Using Other CAD Software:

Most CAD software (FreeCAD, Fusion 360, SolidWorks, etc.) can export to STL format. Look for "Export" or "Save As" options and select STL as the format.

## Adding STL Models to the Application

Once you have converted your .ipt files to .stl:

1. Place all .stl files in `src/assets/shapes/` directory

2. Open `src/assets/shapes/models.ts`

3. Add your models to the `stlModels` array:

```typescript
export const stlModels = [
	{ name: "Part 1A", file: "/src/assets/shapes/PART_1A.stl" },
	{ name: "Part 2A", file: "/src/assets/shapes/PART_2A.stl" },
	{ name: "Part 3A", file: "/src/assets/shapes/PART_3A.stl" },
	// ... add all your parts
	{ name: "Part 20A", file: "/src/assets/shapes/PART_20A.stl" },
];
```

4. Save the file and restart the development server

5. The models will now appear in the Shape Selection step under "Custom STL Models"

## Features

- **Automatic centering**: STL models are automatically centered at the origin
- **Automatic scaling**: Models are scaled to fit within the visualization space
- **Full projection support**: All orthographic projections work with custom STL models
- **Edge detection**: Hidden lines are automatically detected and rendered as dashed lines

## Notes

- STL files should ideally be under 5MB for best performance
- Binary STL files are smaller than ASCII STL files
- The application supports both binary and ASCII STL formats
- Models are loaded asynchronously - there may be a brief loading delay for large files
