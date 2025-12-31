import { create } from "zustand";

interface AppState {
	// Animation control
	unfoldProgress: number;
	setUnfoldProgress: (progress: number) => void;

	// Animation state
	isAnimating: boolean;
	setIsAnimating: (animating: boolean) => void;

	// Object shape selection
	objectShape: "cube" | "cylinder" | "cone" | "complex";
	setObjectShape: (shape: "cube" | "cylinder" | "cone" | "complex") => void;

	// Projection type selection
	projectionType: "first-angle" | "third-angle";
	setProjectionType: (type: "first-angle" | "third-angle") => void;

	// Projection animation state
	projectionAnimationStep:
		| "idle"
		| "front"
		| "top"
		| "side"
		| "leftSide"
		| "returnToStart"
		| "frontViewFlat";
	setProjectionAnimationStep: (
		step:
			| "idle"
			| "front"
			| "top"
			| "side"
			| "leftSide"
			| "returnToStart"
			| "frontViewFlat"
	) => void;

	// User flow control
	selectedView: "front" | "top" | "side" | "leftSide" | null;
	setSelectedView: (
		view: "front" | "top" | "side" | "leftSide" | null
	) => void;
	flowPhase: "setup" | "unfolding" | "complete";
	setFlowPhase: (phase: "setup" | "unfolding" | "complete") => void;
	showObject: boolean;
	setShowObject: (show: boolean) => void;

	// Workflow steps
	workflowStep:
		| "shape-selection"
		| "projection-type"
		| "drawing"
		| "unfolding";
	setWorkflowStep: (
		step: "shape-selection" | "projection-type" | "drawing" | "unfolding"
	) => void;

	// Visibility control for projections
	showFrontView: boolean;
	showTopView: boolean;
	showSideView: boolean;
	showLeftSideView: boolean;
	setShowFrontView: (show: boolean) => void;
	setShowTopView: (show: boolean) => void;
	setShowSideView: (show: boolean) => void;
	setShowLeftSideView: (show: boolean) => void;

	// Track completed drawings
	frontDrawn: boolean;
	topDrawn: boolean;
	sideDrawn: boolean;
	leftSideDrawn: boolean;
	setFrontDrawn: (drawn: boolean) => void;
	setTopDrawn: (drawn: boolean) => void;
	setSideDrawn: (drawn: boolean) => void;
	setLeftSideDrawn: (drawn: boolean) => void;

	// Highlighted plane for visual feedback
	highlightedPlane: "front" | "top" | "side" | "leftSide" | null;
	setHighlightedPlane: (
		plane: "front" | "top" | "side" | "leftSide" | null
	) => void;

	// Camera position for debugging
	cameraPosition: { x: number; y: number; z: number };
	setCameraPosition: (pos: { x: number; y: number; z: number }) => void;

	// Camera rotation for debugging (includes Euler order)
	cameraRotation: { x: number; y: number; z: number; order: string };
	setCameraRotation: (rot: {
		x: number;
		y: number;
		z: number;
		order: string;
	}) => void;
}

export const useStore = create<AppState>((set) => ({
	// Default values
	unfoldProgress: 0,
	setUnfoldProgress: (progress) => set({ unfoldProgress: progress }),

	isAnimating: false,
	setIsAnimating: (animating) => set({ isAnimating: animating }),

	objectShape: "cube",
	setObjectShape: (shape) => set({ objectShape: shape }),

	projectionType: "first-angle",
	setProjectionType: (type) => set({ projectionType: type }),

	projectionAnimationStep: "idle",
	setProjectionAnimationStep: (step) =>
		set({ projectionAnimationStep: step }),

	selectedView: "front",
	setSelectedView: (view) => set({ selectedView: view }),

	flowPhase: "setup",
	setFlowPhase: (phase) => set({ flowPhase: phase }),

	showObject: true,
	setShowObject: (show) => set({ showObject: show }),

	workflowStep: "shape-selection",
	setWorkflowStep: (step) => set({ workflowStep: step }),

	showFrontView: false,
	showTopView: false,
	showSideView: false,
	showLeftSideView: false,
	setShowFrontView: (show) => set({ showFrontView: show }),
	setShowTopView: (show) => set({ showTopView: show }),
	setShowSideView: (show) => set({ showSideView: show }),
	setShowLeftSideView: (show) => set({ showLeftSideView: show }),

	frontDrawn: false,
	topDrawn: false,
	sideDrawn: false,
	leftSideDrawn: false,
	setFrontDrawn: (drawn) => set({ frontDrawn: drawn }),
	setTopDrawn: (drawn) => set({ topDrawn: drawn }),
	setSideDrawn: (drawn) => set({ sideDrawn: drawn }),
	setLeftSideDrawn: (drawn) => set({ leftSideDrawn: drawn }),

	highlightedPlane: "front",
	setHighlightedPlane: (plane) => set({ highlightedPlane: plane }),

	cameraPosition: { x: -8, y: 6, z: 8 },
	setCameraPosition: (pos) => set({ cameraPosition: pos }),

	cameraRotation: { x: 0, y: 0, z: 0, order: "XYZ" },
	setCameraRotation: (rot) => set({ cameraRotation: rot }),
}));
