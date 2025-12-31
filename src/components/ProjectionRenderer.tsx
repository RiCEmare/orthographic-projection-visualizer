import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useStore } from "../store/useStore";

/**
 * Helper function to project a vertex onto a plane by dropping one axis
 */
function projectVertex(
	vertex: THREE.Vector3,
	dropAxis: "x" | "y" | "z"
): THREE.Vector3 {
	const projected = vertex.clone();
	switch (dropAxis) {
		case "z":
			projected.z = 0;
			break;
		case "y":
			projected.y = 0;
			break;
		case "x":
			projected.x = 0;
			break;
	}
	return projected;
}

/**
 * Advanced Orthographic Projection Renderer
 *
 * MECHANISM:
 * 1. Creates a geometric representation of the 3D object
 * 2. Extracts all edges from the geometry
 * 3. Projects vertices onto the target plane using orthographic projection
 * 4. Uses raycasting to detect occlusion (hidden lines)
 * 5. Renders visible edges as solid lines, hidden edges as dashed lines
 *
 * PROJECTION MATH:
 * - Front View (VP): Project onto Z=0 plane, drop Z coordinate
 * - Top View (HP): Project onto Y=0 plane, drop Y coordinate
 * - Side View (PP): Project onto X=0 plane, drop X coordinate
 *
 * HIDDEN LINE DETECTION:
 * - Cast ray from projection plane toward object along projection direction
 * - If ray hits object before reaching the edge, edge is hidden (occluded)
 * - Visible edges: solid black lines
 * - Hidden edges: dashed gray lines
 */

interface ProjectionProps {
	view: "front" | "top" | "side";
	visible: boolean;
}

export function ProjectionRenderer({ view, visible }: ProjectionProps) {
	const { objectShape, projectionType } = useStore();
	const visibleLinesRef = useRef<THREE.LineSegments>(null);
	const hiddenLinesRef = useRef<THREE.LineSegments>(null);

	// Object position based on projection type
	const objectPos = useMemo(() => {
		return projectionType === "first-angle"
			? new THREE.Vector3(0, 2, 2)
			: new THREE.Vector3(0, -2, -2);
	}, [projectionType]);

	// Create geometry for the selected shape
	const geometry = useMemo(() => {
		switch (objectShape) {
			case "cube":
				return new THREE.BoxGeometry(1.5, 1.5, 1.5);
			case "cylinder":
				return new THREE.CylinderGeometry(0.75, 0.75, 1.5, 32);
			case "cone":
				return new THREE.ConeGeometry(0.75, 1.5, 32);
			case "complex":
				// Merge box and cylinder geometries
				const box = new THREE.BoxGeometry(1.5, 0.8, 1.5);
				box.translate(0, -0.5, 0);
				const cyl = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
				cyl.translate(0, 0.5, 0);

				const mergedGeometry = new THREE.BufferGeometry();
				const boxPos = box.attributes.position.array;
				const cylPos = cyl.attributes.position.array;
				const positions = new Float32Array(
					boxPos.length + cylPos.length
				);
				positions.set(boxPos);
				positions.set(cylPos, boxPos.length);
				mergedGeometry.setAttribute(
					"position",
					new THREE.BufferAttribute(positions, 3)
				);

				return mergedGeometry;
			default:
				return new THREE.BoxGeometry(1.5, 1.5, 1.5);
		}
	}, [objectShape]);

	// Extract edges and project them
	const { visibleEdges, hiddenEdges, position, rotation } = useMemo(() => {
		const edges = new THREE.EdgesGeometry(geometry);
		const posArray = edges.attributes.position.array;

		// Projection parameters based on view
		let projectionDir: THREE.Vector3;
		let planePosition: THREE.Vector3;
		let dropAxis: "x" | "y" | "z";
		let rotation: THREE.Euler;
		let centerOffset: THREE.Vector3;
		let dirSign: number;

		switch (view) {
			case "front": // Project onto VP (Z=0)
				dirSign = objectPos.z >= 0 ? 1 : -1;
				projectionDir = new THREE.Vector3(0, 0, dirSign);
				planePosition = new THREE.Vector3(objectPos.x, objectPos.y, 0);
				dropAxis = "z";
				rotation = new THREE.Euler(0, 0, 0);
				centerOffset = new THREE.Vector3(objectPos.x, objectPos.y, 0);
				break;
			case "top": // Project onto HP (Y=0)
				dirSign = objectPos.y >= 0 ? -1 : 1; // project toward object from plane
				projectionDir = new THREE.Vector3(0, dirSign, 0);
				planePosition = new THREE.Vector3(objectPos.x, 0, 0);
				dropAxis = "y";
				rotation = new THREE.Euler(Math.PI / 2, 0, 0);
				// Position projection on opposite halves based on angle
				centerOffset = new THREE.Vector3(
					objectPos.x,
					0,
					projectionType === "first-angle" ? 0 : 0
				);
				break;
			case "side": // Project onto PP (X=0)
				dirSign = objectPos.x >= 0 ? 1 : -1;
				projectionDir = new THREE.Vector3(dirSign, 0, 0);
				planePosition = new THREE.Vector3(0, 0, 0);
				dropAxis = "x";
				rotation = new THREE.Euler(0, Math.PI / 2, 0); // Align Z to horizontal on PP
				centerOffset = new THREE.Vector3(0, objectPos.y, objectPos.z);
				break;
			default:
				dirSign = 1;
				projectionDir = new THREE.Vector3(0, 0, 1);
				planePosition = new THREE.Vector3(0, 0, 0);
				dropAxis = "z";
				rotation = new THREE.Euler(0, 0, 0);
				centerOffset = new THREE.Vector3(0, 0, 0);
		}

		// Create raycaster for occlusion detection
		const raycaster = new THREE.Raycaster();
		const tempMesh = new THREE.Mesh(geometry);
		tempMesh.position.copy(objectPos);
		tempMesh.updateMatrixWorld();

		const visiblePositions: number[] = [];
		const hiddenPositions: number[] = [];

		// Process each edge (pairs of vertices)
		for (let i = 0; i < posArray.length; i += 6) {
			// Get edge vertices in local space
			const v1Local = new THREE.Vector3(
				posArray[i],
				posArray[i + 1],
				posArray[i + 2]
			);
			const v2Local = new THREE.Vector3(
				posArray[i + 3],
				posArray[i + 4],
				posArray[i + 5]
			);

			// Transform to world space
			const v1World = v1Local.clone().add(objectPos);
			const v2World = v2Local.clone().add(objectPos);

			// Project vertices onto the plane
			const v1Proj = projectVertex(v1World, dropAxis).sub(centerOffset);
			const v2Proj = projectVertex(v2World, dropAxis).sub(centerOffset);

			// Check if edge is occluded (hidden)
			const edgeMidpoint = new THREE.Vector3().lerpVectors(
				v1World,
				v2World,
				0.5
			);
			const rayOrigin = edgeMidpoint.clone();
			const epsilon = 0.001;
			switch (dropAxis) {
				case "z":
					rayOrigin.z = planePosition.z - dirSign * epsilon;
					break;
				case "y":
					rayOrigin.y = planePosition.y - dirSign * epsilon;
					break;
				case "x":
					rayOrigin.x = planePosition.x - dirSign * epsilon;
					break;
			}

			raycaster.set(rayOrigin, projectionDir.clone());
			const intersects = raycaster.intersectObject(tempMesh);

			// Determine if edge is visible or hidden
			const isVisible =
				intersects.length === 0 ||
				intersects[0].distance >
					rayOrigin.distanceTo(edgeMidpoint) - 0.1;

			if (isVisible) {
				visiblePositions.push(v1Proj.x, v1Proj.y, v1Proj.z);
				visiblePositions.push(v2Proj.x, v2Proj.y, v2Proj.z);
			} else {
				hiddenPositions.push(v1Proj.x, v1Proj.y, v1Proj.z);
				hiddenPositions.push(v2Proj.x, v2Proj.y, v2Proj.z);
			}
		}

		const visibleGeometry = new THREE.BufferGeometry();
		visibleGeometry.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(visiblePositions, 3)
		);

		const hiddenGeometry = new THREE.BufferGeometry();
		hiddenGeometry.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(hiddenPositions, 3)
		);

		return {
			visibleEdges: visibleGeometry,
			hiddenEdges: hiddenGeometry,
			position: planePosition,
			rotation,
		};
	}, [geometry, view, objectPos, projectionType]);

	if (!visible) return null;

	return (
		<group
			position={position}
			rotation={[rotation.x, rotation.y, rotation.z]}>
			{/* Visible edges - solid black lines */}
			<lineSegments
				ref={visibleLinesRef}
				geometry={visibleEdges}
				onUpdate={(line) => line.computeLineDistances()}>
				<lineBasicMaterial
					color="#000000"
					linewidth={2}
				/>
			</lineSegments>

			{/* Hidden edges - dashed gray lines */}
			<lineSegments
				ref={hiddenLinesRef}
				geometry={hiddenEdges}
				onUpdate={(line) => line.computeLineDistances()}>
				<lineDashedMaterial
					color="#666666"
					linewidth={1}
					dashSize={0.1}
					gapSize={0.05}
					transparent
					opacity={0.5}
				/>
			</lineSegments>
		</group>
	);
}
