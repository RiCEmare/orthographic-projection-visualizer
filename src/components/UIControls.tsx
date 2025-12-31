import { useStore } from "../store/useStore";
import { useEffect } from "react";

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
		setSelectedView,
		flowPhase,
		setFlowPhase,
		setShowObject,
		showFrontView,
		showTopView,
		showSideView,
		showLeftSideView,
		setShowFrontView,
		setShowTopView,
		setShowSideView,
		setShowLeftSideView,
		frontDrawn,
		topDrawn,
		sideDrawn,
		leftSideDrawn,
		setFrontDrawn,
		setTopDrawn,
		setSideDrawn,
		setLeftSideDrawn,
		setHighlightedPlane,
		workflowStep,
		setWorkflowStep,
		resetAll,
	} = useStore();

	// Get shape emoji/icon
	const getShapeIcon = (shape: "cube" | "cylinder" | "cone" | "complex") => {
		switch (shape) {
			case "cube":
				return "🟦";
			case "cylinder":
				return "🥫";
			case "cone":
				return "🍦";
			case "complex":
				return "⚙️";
		}
	};

	// Get suggested next view based on what's been drawn
	const getNextSuggestedView = ():
		| "front"
		| "top"
		| "side"
		| "leftSide"
		| null => {
		if (!frontDrawn) return "front";
		if (!topDrawn) return "top";
		if (!sideDrawn) return "side";
		if (!leftSideDrawn) return "leftSide";
		return null; // All views drawn
	};

	const handleAnimate = () => {
		if (isAnimating) {
			setIsAnimating(false);
			return;
		}

		setIsAnimating(true);
		const startProgress = unfoldProgress;
		const duration = 2000; // 2 seconds
		const startTime = Date.now();
		let animationId: number | null = null;

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			setUnfoldProgress(startProgress + (1 - startProgress) * progress);

			// Continue animation only if not complete
			if (progress < 1) {
				animationId = requestAnimationFrame(animate);
			} else {
				// Animation complete - stop exactly at target
				setUnfoldProgress(1);
				setIsAnimating(false);
				animationId = null;
			}
		};

		animationId = requestAnimationFrame(animate);
	};

	const handleDrawNextProjection = () => {
		const nextView = getNextSuggestedView();
		if (!nextView) return;

		// Set the selected view to the next one
		setSelectedView(nextView);

		// Animate camera to the next view and draw that projection
		setProjectionAnimationStep(nextView);

		// Mark the view as drawn
		if (nextView === "front") setFrontDrawn(true);
		if (nextView === "top") setTopDrawn(true);
		if (nextView === "side") setSideDrawn(true);
		if (nextView === "leftSide") {
			setLeftSideDrawn(true);
			// After marking the last view as drawn, we'll trigger returnToStart
			// This will happen after the leftSide animation completes and returns
			setTimeout(() => {
				// Check if we're still idle after the leftSide animation
				setProjectionAnimationStep("returnToStart");
			}, 6500); // Wait for leftSide animation to complete (3s to target + 3s return + buffer)
		}
	};

	const handleShapeSelection = (
		shape: "cube" | "cylinder" | "cone" | "complex"
	) => {
		setObjectShape(shape);
		setWorkflowStep("projection-type");
	};

	const handleConfirmProjectionType = () => {
		setWorkflowStep("drawing");
	};

	const handleStartUnfoldSequence = () => {
		setWorkflowStep("unfolding");
		handleStartUnfold();
	};

	const handleStartUnfold = () => {
		// Hide object and start unfold phase without moving camera
		setFlowPhase("unfolding");
		setShowObject(false);
		setUnfoldProgress(0);
		// Camera stays in current position - no animation triggered
	};

	const handleReset = () => {
		// Use the comprehensive resetAll function from the store
		resetAll();
	};

	const nextView = getNextSuggestedView();
	const allViewsDrawn = frontDrawn && topDrawn && sideDrawn && leftSideDrawn;

	// Update highlighted plane based on next view
	useEffect(() => {
		if (workflowStep === "drawing") {
			// During animation, keep highlighting the currently animating view
			if (
				projectionAnimationStep !== "idle" &&
				projectionAnimationStep !== null
			) {
				setHighlightedPlane(
					projectionAnimationStep as
						| "front"
						| "top"
						| "side"
						| "leftSide"
				);
			}
			// When idle and there's a next view, highlight it
			else if (nextView && projectionAnimationStep === "idle") {
				setHighlightedPlane(nextView);
			}
			// Clear highlight when all views are drawn
			else if (allViewsDrawn) {
				setHighlightedPlane(null);
			}
		} else {
			// Clear highlight when not in drawing workflow
			setHighlightedPlane(null);
		}
	}, [
		nextView,
		projectionAnimationStep,
		allViewsDrawn,
		setHighlightedPlane,
		workflowStep,
	]);

	// Get descriptive plane name
	const getPlaneName = (
		view: "front" | "top" | "side" | "leftSide" | null
	) => {
		if (!view) return "";
		if (view === "front") return "Vertical Plane (VP)";
		if (view === "top") return "Horizontal Plane (HP)";
		if (view === "side") return "Profile Plane (PP)";
		if (view === "leftSide") return "Left Profile Plane (PP)";
		return "";
	};

	// Get drawing status message
	const getDrawingMessage = (view: "front" | "top" | "side" | "leftSide") => {
		if (view === "front")
			return "Drawing front view projection on Vertical Plane (VP)";
		if (view === "top")
			return "Drawing top view projection on Horizontal Plane (HP)";
		if (view === "side")
			return "Drawing right hand side view projection on Profile Plane (PP)";
		if (view === "leftSide")
			return "Drawing left hand side view projection on Left Profile Plane (PP)";
		return "";
	};

	return (
		<div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 w-80 z-10">
			<h1 className="text-xl font-bold mb-4 text-gray-800">
				Orthographic Projection Visualizer
			</h1>

			{/* Progress Steps Indicator */}
			<div className="mb-6 flex items-center justify-between text-xs">
				<div
					className={`flex-1 text-center ${
						workflowStep === "shape-selection"
							? "text-blue-600 font-bold"
							: [
									"projection-type",
									"drawing",
									"unfolding",
							  ].includes(workflowStep)
							? "text-green-600"
							: "text-gray-400"
					}`}>
					<div
						className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center ${
							workflowStep === "shape-selection"
								? "bg-blue-600 text-white"
								: [
										"projection-type",
										"drawing",
										"unfolding",
								  ].includes(workflowStep)
								? "bg-green-600 text-white"
								: "bg-gray-300"
						}`}>
						{["projection-type", "drawing", "unfolding"].includes(
							workflowStep
						)
							? "✓"
							: "1"}
					</div>
					Shape
				</div>
				<div className="flex-none w-8 h-0.5 bg-gray-300 mx-1"></div>
				<div
					className={`flex-1 text-center ${
						workflowStep === "projection-type"
							? "text-blue-600 font-bold"
							: ["drawing", "unfolding"].includes(workflowStep)
							? "text-green-600"
							: "text-gray-400"
					}`}>
					<div
						className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center ${
							workflowStep === "projection-type"
								? "bg-blue-600 text-white"
								: ["drawing", "unfolding"].includes(
										workflowStep
								  )
								? "bg-green-600 text-white"
								: "bg-gray-300"
						}`}>
						{["drawing", "unfolding"].includes(workflowStep)
							? "✓"
							: "2"}
					</div>
					Type
				</div>
				<div className="flex-none w-8 h-0.5 bg-gray-300 mx-1"></div>
				<div
					className={`flex-1 text-center ${
						workflowStep === "drawing"
							? "text-blue-600 font-bold"
							: workflowStep === "unfolding"
							? "text-green-600"
							: "text-gray-400"
					}`}>
					<div
						className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center ${
							workflowStep === "drawing"
								? "bg-blue-600 text-white"
								: workflowStep === "unfolding"
								? "bg-green-600 text-white"
								: "bg-gray-300"
						}`}>
						{workflowStep === "unfolding" ? "✓" : "3"}
					</div>
					Draw
				</div>
				<div className="flex-none w-8 h-0.5 bg-gray-300 mx-1"></div>
				<div
					className={`flex-1 text-center ${
						workflowStep === "unfolding"
							? "text-blue-600 font-bold"
							: "text-gray-400"
					}`}>
					<div
						className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center ${
							workflowStep === "unfolding"
								? "bg-blue-600 text-white"
								: "bg-gray-300"
						}`}>
						4
					</div>
					Unfold
				</div>
			</div>

			{/* STEP 1: Shape Selection */}
			{workflowStep === "shape-selection" && (
				<div className="space-y-4">
					<div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
						<p className="text-sm font-semibold text-blue-800 mb-1">
							Step 1: Choose Object Shape
						</p>
						<p className="text-xs text-blue-700">
							Select the 3D object you want to project
						</p>
					</div>

					<div className="grid grid-cols-2 gap-3">
						{(["cube", "cylinder", "cone", "complex"] as const).map(
							(shape) => (
								<button
									key={shape}
									onClick={() => handleShapeSelection(shape)}
									className="group relative px-4 py-6 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
									<div className="text-4xl mb-2">
										{getShapeIcon(shape)}
									</div>
									<div className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
										{shape.charAt(0).toUpperCase() +
											shape.slice(1)}
									</div>
								</button>
							)
						)}
					</div>
				</div>
			)}

			{/* STEP 2: Projection Type Selection */}
			{workflowStep === "projection-type" && (
				<div className="space-y-4">
					<div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
						<p className="text-sm font-semibold text-blue-800 mb-1">
							Step 2: Confirm Projection Type
						</p>
						<p className="text-xs text-blue-700">
							Selected: {getShapeIcon(objectShape)}{" "}
							{objectShape.charAt(0).toUpperCase() +
								objectShape.slice(1)}
						</p>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<button
							onClick={() => setProjectionType("first-angle")}
							className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${
								projectionType === "first-angle"
									? "bg-purple-600 text-white border-purple-600"
									: "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
							}`}>
							First Angle
						</button>
						<button
							onClick={() => setProjectionType("third-angle")}
							className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${
								projectionType === "third-angle"
									? "bg-purple-600 text-white border-purple-600"
									: "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
							}`}>
							Third Angle
						</button>
					</div>

					<div className="p-3 bg-gray-50 rounded text-xs text-gray-700">
						<strong>
							{projectionType === "first-angle"
								? "First Angle:"
								: "Third Angle:"}
						</strong>{" "}
						{projectionType === "first-angle"
							? "Object is between observer and planes"
							: "Planes are between observer and object"}
					</div>

					<button
						onClick={handleConfirmProjectionType}
						className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
						Confirm & Start Drawing →
					</button>

					<button
						onClick={() => setWorkflowStep("shape-selection")}
						className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors">
						← Back to Shape Selection
					</button>
				</div>
			)}

			{/* STEP 3: Drawing Projections */}
			{workflowStep === "drawing" && (
				<div className="space-y-4">
					{allViewsDrawn && (
						<div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded">
							<p className="text-sm font-semibold text-blue-800 mb-1">
								🎉 All views drawn!
							</p>
							<p className="text-sm text-blue-700">
								Ready to move to observer position and unfold.
							</p>
						</div>
					)}

					{nextView && (
						<button
							onClick={handleDrawNextProjection}
							disabled={projectionAnimationStep !== "idle"}
							className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors text-lg ${
								projectionAnimationStep !== "idle"
									? "bg-gray-400 cursor-not-allowed text-gray-200"
									: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
							}`}>
							{projectionAnimationStep === "idle"
								? `🎨 Draw ${
										nextView === "side"
											? "Right Side"
											: nextView === "leftSide"
											? "Left Side"
											: nextView.charAt(0).toUpperCase() +
											  nextView.slice(1)
								  } View`
								: getDrawingMessage(
										projectionAnimationStep as
											| "front"
											| "top"
											| "side"
											| "leftSide"
								  )}
						</button>
					)}

					{allViewsDrawn && projectionAnimationStep === "idle" && (
						<button
							onClick={handleStartUnfoldSequence}
							className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
							Continue to Unfolding →
						</button>
					)}
				</div>
			)}

			{/* STEP 4: Unfolding */}
			{workflowStep === "unfolding" && (
				<div className="space-y-4">
					<div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
						<p className="text-sm font-semibold text-blue-800 mb-1">
							Step 4: Unfold the Planes
						</p>
						<p className="text-xs text-blue-700">
							Watch the projection planes unfold to 2D
						</p>
					</div>

					<div>
						<label className="text-xs text-gray-600 mb-1 block font-semibold">
							Unfold Progress: {Math.round(unfoldProgress * 100)}%
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
							className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
							{isAnimating ? "⏸ Stop" : "▶ Animate"}
						</button>
					</div>

					<div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
						<p className="text-xs text-blue-800 leading-relaxed">
							<strong>Note:</strong>{" "}
							{projectionType === "first-angle" ? (
								<>
									In <strong>First Angle Projection</strong>,
									the object is between the observer and the
									projection planes. Watch how the planes
									unfold: Top View below Front, Right Side
									View to the left.
								</>
							) : (
								<>
									In <strong>Third Angle Projection</strong>,
									the projection planes are between the
									observer and the object. The views unfold:
									Top View above Front, Right Side View to the
									right.
								</>
							)}
						</p>
					</div>
				</div>
			)}

			{/* Reset Button - Always visible */}
			<div className="mt-6 pt-4 border-t border-gray-200">
				<button
					onClick={handleReset}
					className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm">
					🔄 Start Over
				</button>
			</div>
		</div>
	);
}
