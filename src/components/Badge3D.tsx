import { Decal, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { Badge, CANVAS_SIZE } from "./Badge";

export default function Badge3D({ data }: { data: BadgeData }) {
    const [autoRotate, setAutoRotate] = useState(true);
    return (
        <Canvas
            style={{
                width: `${CANVAS_SIZE * 2}mm`,
                height: `${CANVAS_SIZE * 2}mm`,
            }}
        >
            <ambientLight intensity={0.5 * Math.PI} />
            <pointLight position={[10, 10, 10]} />
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <BadgeObj data={data} autoRotate={autoRotate} />
            <OrbitControls
                enableZoom={true}
                onStart={(e) => setAutoRotate(false)}
            />
        </Canvas>
    );
}

function BadgeObj({
    data,
    autoRotate,
}: {
    data: BadgeData;
    autoRotate: boolean;
}) {
    const [badgeMesh, setBadgeMesh] = useState<THREE.BufferGeometry | null>(
        null,
    );
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    const groupRef = useRef<THREE.Group | null>(null);

    // Load the raw mesh from the OBJ file
    useEffect(() => {
        const loader = new OBJLoader();
        loader.load(
            "/badge.obj",
            (object) => {
                object.traverse((c) => {
                    if (c.type === "Mesh") {
                        setBadgeMesh((c as THREE.Mesh).geometry);
                    }
                });
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            (error) => {
                console.error("Error loading OBJ file:", error);
            },
        );
    }, []);

    useEffect(() => {
        const svgContent = renderToStaticMarkup(
            <Badge data={data} showGuides={false} />,
        );
        const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);
        const textureLoader = new THREE.TextureLoader();

        textureLoader.load(
            url,
            (loadedTexture) => {
                loadedTexture.needsUpdate = true;
                setTexture(loadedTexture);
                URL.revokeObjectURL(url);
            },
            undefined,
            (error) => console.error("Error loading texture:", error),
        );

        return () => URL.revokeObjectURL(url);
    }, [data]);

    useFrame(({ clock }) => {
        if (autoRotate && groupRef.current) {
            groupRef.current.rotation.y =
                (Math.sin(clock.elapsedTime) * Math.PI) / 4;
        }
    });

    return (
        <group ref={groupRef}>
            <group rotation={[Math.PI / 3, -Math.PI / 2, 0]} scale={[2, 2, 2]}>
                <mesh>
                    <cylinderGeometry args={[0.99, 0.99, 0.1, 32]} />
                    <meshStandardMaterial color="#888" />
                </mesh>
                {badgeMesh && (
                    <mesh geometry={badgeMesh}>
                        {texture && (
                            <Decal
                                debug={true}
                                position={[0, 0.15, 0]}
                                rotation={[0, 0, Math.PI / 2]}
                                scale={[0.4, 2.55, 2.55]}
                            >
                                <meshStandardMaterial
                                    map={texture}
                                    polygonOffset={true}
                                    polygonOffsetFactor={-1} // Adjust this value to avoid z-fighting
                                />
                            </Decal>
                        )}
                    </mesh>
                )}
            </group>
        </group>
    );
}
