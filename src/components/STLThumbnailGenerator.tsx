import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { STLModel } from "./STLModel";

interface STLThumbnailGeneratorProps {
	models: Array<{ name: string; file: string | null }>;
	onThumbnailsGenerated: (thumbnails: Record<string, string>) => void;
}

/**
 * Hidden component that generates thumbnail images for STL models
 * Uses a single Canvas to render all models sequentially
 */
export function STLThumbnailGenerator({
	models,
	onThumbnailsGenerated,
}: STLThumbnailGeneratorProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
	const canvasRef = useRef<HTMLDivElement>(null);
	const captureTimeoutRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		if (currentIndex >= models.length) {
			// All thumbnails generated
			onThumbnailsGenerated(thumbnails);
			return;
		}

		// Wait for model to render, then capture
		captureTimeoutRef.current = setTimeout(() => {
			const canvas = canvasRef.current?.querySelector("canvas");
			if (canvas) {
				try {
					const dataUrl = canvas.toDataURL("image/png");
					const currentModel = models[currentIndex];

					setThumbnails((prev) => ({
						...prev,
						[currentModel.file || ""]: dataUrl,
					}));

					// Move to next model
					setCurrentIndex((prev) => prev + 1);
				} catch (error) {
					console.error("Failed to capture thumbnail:", error);
					// Skip this model and move to next
					setCurrentIndex((prev) => prev + 1);
				}
			}
		}, 1000); // Wait 1000ms for model to fully load and render

		return () => {
			if (captureTimeoutRef.current) {
				clearTimeout(captureTimeoutRef.current);
			}
		};
	}, [currentIndex, models, thumbnails, onThumbnailsGenerated]);

	const currentModel = models[currentIndex];

	if (!currentModel || currentIndex >= models.length) {
		return null;
	}

	return (
		<div
			ref={canvasRef}
			style={{
				position: "fixed",
				left: "-9999px",
				width: "200px",
				height: "200px",
			}}>
			<Canvas
				camera={{ position: [2, 2, 2], fov: 50 }}
				gl={{ preserveDrawingBuffer: true, antialias: true }}>
				<ambientLight intensity={0.6} />
				<directionalLight
					position={[5, 5, 5]}
					intensity={0.8}
				/>
				<Suspense fallback={null}>
					{currentModel.file && <STLModel url={currentModel.file} />}
				</Suspense>
			</Canvas>
		</div>
	);
}
