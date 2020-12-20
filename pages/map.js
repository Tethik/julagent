import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Text, Rect, Shape, Circle } from "react-konva";
import useImage from "use-image";
import Layout from "../components/layout";
import useZones from "../client/swr/useZones";

const MAP_HEIGHT = 660;
const MAP_WIDTH = 1689;

const MapImage = () => {
  const [image] = useImage("/images/karta.png");
  return <Image image={image} width={MAP_WIDTH} height={MAP_HEIGHT} />;
};

const stageBoundsFunc = (pos) => {
  return {
    x: Math.min(0, Math.max(pos.x, -(MAP_WIDTH - window.innerWidth))),
    y: Math.min(0, Math.max(pos.y, -(MAP_HEIGHT - window.innerHeight))),
  };
};

const Zone = ({ edges, bounds }) => {
  const shapeRef = useRef(null);
  const textRef = useRef(null);

  console.log(bounds);
  // useEffect(() => {
  //   console.log(shapeRef.current);
  //   shapeRef.current && shapeRef.current.cache({ ...edges[0], ...bounds, pixelRatio: 1 });
  // }, [shapeRef, bounds, edges]);

  // useEffect(() => {
  //   textRef.current && textRef.current.cache();
  // }, [textRef]);

  return (
    <>
      <Shape
        ref={(node) => node && node.cache({ ...edges[0], pixelRatio: 1, drawBorder: true })}
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(edges[0].x, edges[0].y);
          edges.slice(1).forEach((edge) => {
            context.lineTo(edge.x, edge.y);
          });
          context.closePath();
          // (!) Konva specific method, it is very important
          context.fillStrokeShape(shape);
        }}
        fill="#333333"
        opacity={0.6}
        applyCache
      />
      <Text
        ref={(node) => node && node.cache()}
        align={"center"}
        text={"okänd"}
        x={edges.map((e) => e.x).reduce((p, v) => Math.min(p, v)) + 10}
        y={edges.map((e) => e.y).reduce((p, v) => p + v / edges.length, 0)}
        applyCache
      />
    </>
  );
};

const CanvasMap = () => {
  if (typeof window === "undefined") return null;

  const { zones, isLoading, isError } = useZones();
  const [bounds, setBounds] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { width, height } = bounds;

  console.log(zones);

  const canvasClick = (e) => {
    const pos = e.currentTarget.getPointerPosition();
    setNewShapeEdges([...newShapeEdges, pos]);
  };

  useEffect(() => {
    const listener = window.addEventListener("resize", () => {
      setBounds({ width: window.innerWidth, height: window.innerHeight });
    });
    return () => window.removeEventListener("resize", listener);
  }, []);

  return (
    <Stage
      width={width}
      height={height}
      dragBoundFunc={stageBoundsFunc}
      onClick={(e) => drawing && canvasClick(e)}
      draggable
      transformsEnabled="position"
    >
      <Layer>
        <MapImage />
      </Layer>

      {zones && (
        <Layer>
          {zones.map((zone) => (
            <Zone edges={zone.edges} bounds={bounds} />
          ))}
        </Layer>
      )}
    </Stage>
  );
};

export default function Map() {
  return (
    <>
      <Head>
        <title>Karta</title>
      </Head>
      <body>
        <div>
          <CanvasMap />
        </div>
      </body>
    </>
  );
}
