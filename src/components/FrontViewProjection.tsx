import { useStore } from "../store/useStore";
import { ProjectionRenderer } from "./ProjectionRenderer";

/**
 * Front View Projection Component
 * Renders the orthographic projection onto the Vertical Plane (VP)
 */
export function FrontViewProjection() {
	const { showFrontView } = useStore();

	return (
		<ProjectionRenderer
			view="front"
			visible={showFrontView}
		/>
	);
}
