import { useStore } from "../store/useStore";
import { ProjectionRenderer } from "./ProjectionRenderer";

/**
 * Right Side View Projection Component
 * Renders the orthographic projection onto the Profile Plane (PP)
 * CRITICAL: Must be placed inside the ProfilePlane group
 */
export function RightSideViewProjection() {
	const { showSideView } = useStore();

	return (
		<ProjectionRenderer
			view="side"
			visible={showSideView}
		/>
	);
}
