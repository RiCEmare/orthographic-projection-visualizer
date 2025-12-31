import { useStore } from "../store/useStore";

/**
 * UI Controls panel using Tailwind CSS.
 * Provides user-friendly interface for controlling the visualization.
 */
export function UIControls() {
	const {
		unfoldProgress,
		setUnfoldProgress,
		isAnimating,
		setIsAnimating,
		objectShape,
		setObjectShape,
		projectionType,
		setProjectionType,
		projectionAnimationStep,
		setProjectionAnimationStep,
		cameraPosition,
		cameraRotation,
	} = useStore();

	const handleAnimate = () => {
		if (isAnimating) {
			setIsAnimating(false);
			return;
		}

		setIsAnimating(true);
		const startProgress = unfoldProgress;
		const duration = 2000; // 2 seconds
		const startTime = Date.now();

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			setUnfoldProgress(startProgress + (1 - startProgress) * progress);

			if (progress < 1 && isAnimating) {
				requestAnimationFrame(animate);
			} else {
				setIsAnimating(false);
			}
		};

		requestAnimationFrame(animate);
	};

	const handleShowProjections = () => {
		// Start the projection animation sequence
		setProjectionAnimationStep("front");
	};

	return (
		<div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 w-80 z-10">
			<h1 className="text-xl font-bold mb-4 text-gray-800">
				Orthographic Projection Visualizer
			</h1>

			{/* Camera Debug Info */}
			<div className="mb-4 p-2 bg-gray-100 rounded text-xs font-mono">
				<div className="text-gray-600 font-semibold mb-1">
					Camera Position:
				</div>
				<div className="text-gray-800 mb-2">
					X: {cameraPosition.x.toFixed(2)} | Y:{" "}
					{cameraPosition.y.toFixed(2)} | Z:{" "}
					{cameraPosition.z.toFixed(2)}
				</div>
				<div className="text-gray-600 font-semibold mb-1">
					Camera Rotation (deg):
				</div>
				<div className="text-gray-800">
					X: {cameraRotation.x.toFixed(2)}° | Y:{" "}
					{cameraRotation.y.toFixed(2)}° | Z:{" "}
					{cameraRotation.z.toFixed(2)}°
				</div>
				<div className="text-gray-600 text-xs mt-1">
					Order: {cameraRotation.order}
				</div>
			</div>

			{/* Projection Type Selection */}
			<div className="mb-6">
				<h2 className="text-sm font-semibold mb-2 text-gray-700">
					Projection Type
				</h2>
				<div className="grid grid-cols-2 gap-2">
					<button
						onClick={() => setProjectionType("first-angle")}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
							projectionType === "first-angle"
								? "bg-purple-600 text-white"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}>
						First Angle
					</button>
					<button
						onClick={() => setProjectionType("third-angle")}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
							projectionType === "third-angle"
								? "bg-purple-600 text-white"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}>
						Third Angle
					</button>
				</div>
			</div>

			{/* Object Shape Selection */}
			<div className="mb-6">
				<h2 className="text-sm font-semibold mb-2 text-gray-700">
					Object Shape
				</h2>
				<div className="grid grid-cols-2 gap-2">
					{(["cube", "cylinder", "cone", "complex"] as const).map(
						(shape) => (
							<button
								key={shape}
								onClick={() => setObjectShape(shape)}
								className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
									objectShape === shape
										? "bg-blue-600 text-white"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}>
								{shape.charAt(0).toUpperCase() + shape.slice(1)}
							</button>
						)
					)}
				</div>
			</div>

			{/* Show Projections Button */}
			<div className="mb-6">
				<button
					onClick={handleShowProjections}
					disabled={projectionAnimationStep !== "idle"}
					className={`w-full px-4 py-3 rounded-md font-semibold transition-colors ${
						projectionAnimationStep !== "idle"
							? "bg-gray-400 cursor-not-allowed text-gray-200"
							: "bg-indigo-600 text-white hover:bg-indigo-700"
					}`}>
					{projectionAnimationStep === "idle"
						? "Show Projections"
						: `Showing: ${
								projectionAnimationStep === "front"
									? "Front View"
									: projectionAnimationStep === "top"
									? "Top View"
									: "Side View"
						  }`}
				</button>
			</div>

			{/* Unfolding Controls */}
			<div className="mb-6">
				<h2 className="text-sm font-semibold mb-2 text-gray-700">
					Unfolding Animation
				</h2>
				<div className="space-y-3">
					<div>
						<label className="text-xs text-gray-600 mb-1 block">
							Progress: {Math.round(unfoldProgress * 100)}%
						</label>
						<input
							type="range"
							min="0"
							max="1"
							step="0.01"
							value={unfoldProgress}
							onChange={(e) =>
								setUnfoldProgress(parseFloat(e.target.value))
							}
							className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
						/>
					</div>

					<div className="flex gap-2">
						<button
							onClick={handleAnimate}
							className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
							{isAnimating ? "Stop" : "Animate"}
						</button>
						<button
							onClick={() => setUnfoldProgress(0)}
							className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium">
							Reset
						</button>
					</div>
				</div>
			</div>

			{/* Educational Note */}
			<div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-200">
				<p className="text-xs text-blue-800 leading-relaxed">
					<strong>Educational Note:</strong>{" "}
					{projectionType === "first-angle" ? (
						<>
							In <strong>First Angle Projection</strong>, the
							object is between the observer and the projection
							planes. Watch how the planes unfold: Top View below
							Front, Right Side View to the left.
						</>
					) : (
						<>
							In <strong>Third Angle Projection</strong>, the
							projection planes are between the observer and the
							object. The views unfold: Top View above Front,
							Right Side View to the right.
						</>
					)}
				</p>
			</div>
		</div>
	);
}
