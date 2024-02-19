import React, { useRef, useEffect, useState } from "react";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { useFrame, useThree } from "@react-three/fiber";
import Grass from "./Grass";
import { Model } from "./Tree";
import customerData from "./csvjson.json";
import { MapControls } from "three/addons/controls/MapControls.js";
import { useControls } from "leva";
import axios from "axios";
import Papa from "papaparse";

export default function Controls({ handleModelClick }) {
  const { camera, gl, scene } = useThree();
  const [data, setData] = useState([]);

  const treeSpacing = 250; // Adjust the spacing between trees
  const numTreesPerRow = 12; // Number of trees in each row
  let controls;

  function parseCSVFromURL(url) {
    return new Promise((resolve, reject) => {
      Papa.parse(url, {
        download: true,
        header: true, // Assumes the first row contains headers
        complete: (result) => {
          resolve(result.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  function parseCSV(csvText) {
    const rows = csvText.split(/\r?\n/); // Split CSV text into rows, handling '\r' characters
    const headers = rows[0].split(","); // Extract headers (assumes the first row is the header row)
    const data = []; // Initialize an array to store parsed data
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(","); // Split the row, handling '\r' characters
      const rowObject = {};
      for (let j = 0; j < headers.length; j++) {
        rowObject[headers[j]] = rowData[j];
      }
      data.push(rowObject);
    }
    return data;
  }
  const fetchCSVData = () => {
    const csvUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6WiJQeX9yG43YwfCxHNPTwgcaEklwZUKaiTyYNTa5bggadfILyHm40ZI_dsWp4lRDhBQo6TF37SeF/pub?output=csv"; // Replace with your Google Sheets CSV file URL

    parseCSVFromURL(csvUrl)
      .then((data) => {
        console.log("Parsed CSV data:", data);
        setData(data);
      })
      .catch((error) => {
        console.error("Error parsing CSV:", error);
      });
  };
  useEffect(() => {
    fetchCSVData();
  }, []);

  useEffect(() => {
    controls = new MapControls(camera, gl.domElement);
    //adjust camera angle

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.5;
    //increase speed
    // controls.rotateSpeed = 10;
    // controls.zoomSpeed = 3;
    controls.panSpeed = 2;

    controls.screenSpacePanning = false;

    controls.minDistance = 300;
    controls.maxDistance = 1200;
  }, [camera, gl]);

  // useFrame(() => {
  //   camera.lookAt(0, 5, 0);
  // });
  return (
    <group>
      <group rotation={[0, 5.690000000000005, 0]} position={[-1160, 0, -2420]}>
        <Grass position-x={40} />
        {data.length > 0 &&
          data
            .sort((a, b) => b.Name.localeCompare(a.Name))
            .map((customer, index) => {
              const scalingFactor = 0;
              const row = Math.floor(index / numTreesPerRow);
              const col = index % numTreesPerRow;
              const x =
                col * treeSpacing + (Math.random() - 0.5) * scalingFactor;
              const z =
                row * treeSpacing + (Math.random() - 0.5) * scalingFactor;
              return (
                <group position={[-35, 0, -38]}>
                  <Model
                    key={index}
                    position={[x, 0, z]}
                    customer={customer}
                    onClick={handleModelClick}
                  />
                </group>
              );
            })}
      </group>
    </group>
  );
}
