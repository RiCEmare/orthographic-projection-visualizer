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
	projectionAnimationStep: "idle" | "front" | "top" | "side";
	setProjectionAnimationStep: (
		step: "idle" | "front" | "top" | "side"
	) => void;

	// Visibility control for projections
	showFrontView: boolean;
	showTopView: boolean;
	showSideView: boolean;
	setShowFrontView: (show: boolean) => void;
	setShowTopView: (show: boolean) => void;
	setShowSideView: (show: boolean) => void;

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

	showFrontView: false,
	showTopView: false,
	showSideView: false,
	setShowFrontView: (show) => set({ showFrontView: show }),
	setShowTopView: (show) => set({ showTopView: show }),
	setShowSideView: (show) => set({ showSideView: show }),

	cameraPosition: { x: -8, y: 6, z: 8 },
	setCameraPosition: (pos) => set({ cameraPosition: pos }),

	cameraRotation: { x: 0, y: 0, z: 0, order: "XYZ" },
	setCameraRotation: (rot) => set({ cameraRotation: rot }),
}));
