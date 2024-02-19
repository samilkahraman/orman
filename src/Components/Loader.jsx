import React from "react";
import { Html, useProgress } from "@react-three/drei";

export default function Loader() {
  const { progress } = useProgress();
  return (
    <Html
      className='absolute top-0 left-0 bg-white !z-[100] w-screen h-screen flex flex-col gap-y-10 items-center justify-center'
      center
    >
      <img src='/resources/logo2.webp' alt='loader' className='w-80' />
      <div className='text-black text-7xl absolute bottom-5 right-5'>
        {progress.toFixed(0)}
      </div>
    </Html>
  );
}
