import React, { useMemo, useRef, useState } from "react";
import { ContactShadows, Text, useGLTF } from "@react-three/drei";
import { Html } from "@react-three/drei";

export function Model({ position, customer, onClick }) {
  const gltf = useGLTF("/low_poly_pine_tree.glb");
  const mesh = useRef();

  const clonedGltf = useMemo(() => {
    if (gltf.scene) {
      const cloned = gltf.scene.clone(true);

      cloned.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      return cloned;
    }
  }, [gltf.scene]);

  const handleClick = () => {
    onClick(customer); // Pass the entire customer object
  };

  return (
    <group
      castShadow
      receiveShadow
      onPointerEnter={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        document.body.style.cursor = "auto";
      }}
      dispose={null}
      scale={1.4}
      position={position}
    >
      <primitive
        onClick={handleClick}
        object={clonedGltf}
        ref={mesh}
        scale={3}
      />

      <Text
        fontSize={13}
        position-y={1}
        position-z={40}
        rotation-x={-1.6}
        onClick={handleClick}
        color={"#000000"}
      >
        {customer.Name.replaceAll("İ", "I")
          .replaceAll("ş", "s")
          .replaceAll("Ş", "S")
          .replaceAll("Ğ", "G")
          .replaceAll("ğ", "g")}
      </Text>
    </group>
  );
}
