import Loader from "./Loader";
import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Sky,
  OrbitControls,
  Environment,
  Lightformer,
  ContactShadows,
} from "@react-three/drei";
import { useControls } from "leva";
import DragControls from "./DragControls";

export default function Scene() {
  const [selectedModel, setSelectedModel] = useState(null);
  const modalRef = useRef(null);
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (modalRef.current && modalRef.current.contains(e.target)) {
        return;
      }
      setSelectedModel(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleModelClick = (modelName) => {
    setSelectedModel(modelName);
  };

  const handleCloseModal = () => {
    setSelectedModel(null);
  };

  return (
    <div className='h-screen w-screen relative'>
      <Canvas shadows camera={{ position: [0, 400, 400], far: 20000 }}>
        <Sky azimuth={1} inclination={0.6} distance={12000} />
        <ambientLight castShadow intensity={0.5} />
        <directionalLight
          castShadow
          position={[0, 100, 100]}
          intensity={10}
          color={"#ffffff"}
        />
        <pointLight position={[10, 10, 10]} castShadow receiveShadow />
        <pointLight position={[-10, 10, 10]} castShadow receiveShadow />
        <Suspense fallback={<Loader />}>
          <Environment files={"/venice_sunset_1k.hdr"} />
          <DragControls handleModelClick={handleModelClick} />
        </Suspense>
      </Canvas>
      {/* <div className='absolute text-center top-5 right-5 z-10 flex flex-col text-black'>
        <h2>Controls</h2>
        <span>Drag to move around</span>
        <span>Mouse Scroll to zoom</span>
      </div> */}
      {/* <div className='absolute top-5 right-[50%] translate-x-[50%] z-10 flex flex-col text-black'>
        <span>Click On Tree to View More Details</span>
      </div> */}
      <div className='absolute top-5 left-5  z-10 flex flex-col text-black'>
        <img
          src='/resources/logo2.webp'
          className='w-32 object-contain'
          alt='forest'
        />
      </div>
      {selectedModel && (
        <div
          ref={modalRef}
          className='fixed text-black top-1/2 left-1/2 c transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 py-12 w-[95vw] md:w-[40rem]'
        >
          <h1 className='text-2xl font-bold mb-4'>{selectedModel.Name}</h1>

          <p className='mb-2 font-light'>
            <strong>Şehir:</strong> {selectedModel.City}
          </p>
          <p className='mb-2'>
            <strong>Bağış URL:</strong>{" "}
            <a
              href={selectedModel["Donation URL"]}
              target='_blank'
              rel='noreferrer'
              className='text-blue-500 text-sm'
            >
              {selectedModel["Donation URL"]}
            </a>
          </p>
          <p className='mb-2 font-light'>
            <span className='font-medium'>Durum:</span> {selectedModel.Status}
          </p>
          <p className='mb-2 font-light'>
            <span className='font-medium'>Sipariş No:</span>{" "}
            {selectedModel["Order No"]}
          </p>
          <p className='mb-2 font-light'>
            <span className='font-medium'>Bağış Yapılan Yer:</span>{" "}
            {selectedModel["Donated To"]}
          </p>
          <p className='mb-2 font-light'>
            <span className='font-medium'>Bağış Tarihi:</span>{" "}
            {selectedModel["Donation Date"]}
          </p>
          <p className='mb-4 font-light'>
            <span className='font-medium'>Yorum:</span>{" "}
            {selectedModel.Comment}
          </p>
          <button
            onClick={handleCloseModal}
            className='text-xs px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md'
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  );
}
