import { useStore } from "../store/useStore";
import { ProjectionRenderer } from "./ProjectionRenderer";

/**
 * Left Side View Projection Component
 * Renders the orthographic projection onto the Left Profile Plane (PP)
 * CRITICAL: Must be placed inside the LeftProfilePlane group
 */
export function LeftSideViewProjection() {
	const {
		showLeftSideView,
		projectionAnimationStep,
		cameraAnimationProgress,
	} = useStore();

	// Fade when right view is being drawn
	const shouldFade = projectionAnimationStep === "side";
	const fadeOpacity = shouldFade ? 1 - cameraAnimationProgress : 1;

	return (
		<ProjectionRenderer
			view="leftSide"
			visible={showLeftSideView}
			opacity={fadeOpacity}
		/>
	);
}
