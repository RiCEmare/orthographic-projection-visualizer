import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const models = [
	{ name: "Part 1A", file: "PART_1A.stl" },
	{ name: "Part 2A", file: "PART_2A.stl" },
	{ name: "Part 3A", file: "PART_3A.stl" },
	{ name: "Part 4A", file: "PART_4A.stl" },
	{ name: "Part 5A", file: "PART_5A.stl" },
	{ name: "Part 6A", file: "PART_6A.stl" },
	{ name: "Part 7A", file: "PART_7A.stl" },
	{ name: "Part 8A", file: "PART_8A.stl" },
	{ name: "Part 9A", file: "PART_9A.stl" },
	{ name: "Part 10A", file: "PART_10A.stl" },
	{ name: "Part 11A", file: "PART_11A.stl" },
	{ name: "Part 12A", file: "PART_12A.stl" },
	{ name: "Part 13A", file: "PART_13A.stl" },
	{ name: "Part 14A", file: "PART_14A.stl" },
	{ name: "Part 15A", file: "PART_15A.stl" },
	{ name: "Part 16A", file: "PART_16A.stl" },
	{ name: "Part 17A", file: "PART_17A.stl" },
	{ name: "Part 18A", file: "PART_18A.stl" },
	{ name: "Part 19A", file: "PART_19A.stl" },
	{ name: "Part 20A", file: "PART_20A.stl" },
];

const outputDir = join(__dirname, "../public/thumbnails");

// Ensure output directory exists
try {
	mkdirSync(outputDir, { recursive: true });
	console.log("✓ Created thumbnails directory\n");
} catch (err) {
	if (err.code !== "EEXIST") throw err;
}

async function generateThumbnails() {
	console.log("Starting thumbnail generation using headless browser...\n");
	console.log("Make sure dev server is running on http://localhost:5173\n");

	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	// Navigate to the generator HTML page via dev server
	await page.goto("http://localhost:5173/scripts/generate-thumbnails.html", {
		waitUntil: "networkidle0",
		timeout: 30000,
	});

	console.log("✓ Loaded generator page\n");

	// Wait for THREE to be available
	await page.waitForFunction(
		() =>
			typeof window.THREE !== "undefined" &&
			typeof window.THREE.STLLoader !== "undefined",
		{
			timeout: 10000,
		}
	);

	for (let i = 0; i < models.length; i++) {
		const model = models[i];
		console.log(`[${i + 1}/${models.length}] Processing ${model.name}...`);

		try {
			// Render and capture the thumbnail
			const dataUrl = await page.evaluate(async (modelFile) => {
				return new Promise((resolve, reject) => {
					// Clear previous renders
					const container =
						document.getElementById("canvas-container");
					container.innerHTML = "";

					const canvas = document.createElement("canvas");
					canvas.width = 200;
					canvas.height = 200;
					container.appendChild(canvas);

					const scene = new window.THREE.Scene();
					const camera = new window.THREE.PerspectiveCamera(
						50,
						1,
						0.1,
						1000
					);
					camera.position.set(2, 2, 2);
					camera.lookAt(0, 0, 0);

					const renderer = new window.THREE.WebGLRenderer({
						canvas,
						antialias: true,
						preserveDrawingBuffer: true,
						alpha: true,
					});
					renderer.setSize(200, 200);
					renderer.setClearColor(0xffffff, 1);

					const ambientLight = new window.THREE.AmbientLight(
						0xffffff,
						0.6
					);
					scene.add(ambientLight);

					const directionalLight = new window.THREE.DirectionalLight(
						0xffffff,
						0.8
					);
					directionalLight.position.set(5, 5, 5);
					scene.add(directionalLight);

					const loader = new window.THREE.STLLoader();
					loader.load(
						modelFile,
						(geometry) => {
							geometry.computeBoundingBox();
							const boundingBox = geometry.boundingBox;
							if (boundingBox) {
								const center = new window.THREE.Vector3();
								boundingBox.getCenter(center);
								geometry.translate(
									-center.x,
									-center.y,
									-center.z
								);
							}

							geometry.computeBoundingSphere();
							const scale = geometry.boundingSphere
								? 1.5 / (geometry.boundingSphere.radius * 2)
								: 1;

							const material =
								new window.THREE.MeshStandardMaterial({
									color: 0xffdd57,
									transparent: true,
									opacity: 0.8,
								});

							const mesh = new window.THREE.Mesh(
								geometry,
								material
							);
							mesh.scale.set(scale, scale, scale);

							const edges = new window.THREE.EdgesGeometry(
								geometry,
								15
							);
							const line = new window.THREE.LineSegments(
								edges,
								new window.THREE.LineBasicMaterial({
									color: 0x000000,
								})
							);
							line.scale.set(scale, scale, scale);

							scene.add(mesh);
							scene.add(line);

							renderer.render(scene, camera);

							setTimeout(() => {
								resolve(canvas.toDataURL("image/png"));
							}, 100);
						},
						undefined,
						() => reject(new Error("Failed to load STL"))
					);
				});
			}, `/shapes/${model.file}`);

			// Convert base64 to buffer and save
			const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
			const buffer = Buffer.from(base64Data, "base64");
			const outputPath = join(
				outputDir,
				model.file.replace(".stl", ".png")
			);

			writeFileSync(outputPath, buffer);
			console.log(`  ✓ Saved to ${model.file.replace(".stl", ".png")}`);
		} catch (error) {
			console.error(`  ✗ Failed: ${error.message}`);
		}
	}

	await browser.close();
	console.log("\n✓ All thumbnails generated successfully!");
}

generateThumbnails().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
