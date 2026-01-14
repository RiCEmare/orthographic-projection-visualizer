import { useStore } from "../store/useStore";
import { ProjectionRenderer } from "./ProjectionRenderer";

/**
 * Right Side View Projection Component
 * Renders the orthographic projection onto the Right Profile Plane (PP)
 * CRITICAL: Must be placed inside the RightProfilePlane group
 */
export function RightSideViewProjection() {
	const { showSideView, projectionAnimationStep, cameraAnimationProgress } =
		useStore();

	// Fade when left view is being drawn
	const shouldFade = projectionAnimationStep === "leftSide";
	const fadeOpacity = shouldFade ? 1 - cameraAnimationProgress : 1;

	return (
		<ProjectionRenderer
			view="side"
			visible={showSideView}
			opacity={fadeOpacity}
		/>
	);
}
