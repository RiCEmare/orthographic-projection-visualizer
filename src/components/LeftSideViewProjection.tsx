import { useStore } from "../store/useStore";
import { ProjectionRenderer } from "./ProjectionRenderer";

/**
 * Left Side View Projection Component
 * Renders the orthographic projection onto the Left Profile Plane (PP)
 * CRITICAL: Must be placed inside the LeftProfilePlane group
 */
export function LeftSideViewProjection() {
	const { showLeftSideView } = useStore();

	return (
		<ProjectionRenderer
			view="leftSide"
			visible={showLeftSideView}
		/>
	);
}
