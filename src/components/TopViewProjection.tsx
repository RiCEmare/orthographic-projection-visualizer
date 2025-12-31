import { useStore } from "../store/useStore";
import { ProjectionRenderer } from "./ProjectionRenderer";

/**
 * Top View Projection Component
 * Renders the orthographic projection onto the Horizontal Plane (HP)
 * CRITICAL: Must be placed inside the HorizontalPlane group
 */
export function TopViewProjection() {
	const { showTopView } = useStore();

	return (
		<ProjectionRenderer
			view="top"
			visible={showTopView}
		/>
	);
}
