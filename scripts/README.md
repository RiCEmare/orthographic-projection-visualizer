# STL Thumbnail Generator

This tool generates static thumbnail images for all STL model files.

## Automated Method (Recommended)

Run the Node.js script to automatically generate and save all thumbnails:

```bash
# Make sure the dev server is running first
npm run dev

# In another terminal, run:
npm run generate-thumbnails
```

The script will:
- Launch a headless browser
- Render each STL model
- Automatically save PNG files to `public/thumbnails/`

## Manual Method

If the automated script has issues, use the browser-based generator:

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open the thumbnail generator**:
   ```
   http://localhost:5173/scripts/generate-thumbnails.html
   ```

3. **Click "Generate Thumbnails"**
   - Downloads will start automatically
   - Each thumbnail will be saved to your Downloads folder

4. **Move downloaded images**:
   - Move all PNG files from Downloads to: `public/thumbnails/`

5. **Refresh your app** - thumbnails will appear!

## Benefits

- ✅ No WebGL context exhaustion
- ✅ Instant loading (no generation on app start)
- ✅ Can be version controlled
- ✅ Generate once, use forever
