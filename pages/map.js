import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Text, Rect, Shape, Circle } from "react-konva";
import useImage from "use-image";
import Layout from "../components/layout";
import useZones from "../client/swr/useZones";

const MAP_HEIGHT = 2048;
const MAP_WIDTH = 2048;

const MapImage = () => {
  const [image] = useImage("/images/FNBRC2S1Map.png");
  return <Image image={image} width={MAP_WIDTH} height={MAP_HEIGHT} />;
};

const stageBoundsFunc = (pos) => {
  return {
    x: Math.min(0, Math.max(pos.x, -(MAP_WIDTH - window.innerWidth))),
    y: Math.min(0, Math.max(pos.y, -(MAP_HEIGHT - window.innerHeight))),
  };
};

const Zone = ({ edges, bounds, claimer, name }) => {
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
          context.fillStrokeShape(shape);
        }}
        fill="#333333"
        opacity={0.6}
        applyCache
      />
      <Text
        ref={(node) => node && node.cache()}
        align={"center"}
        text={name}
        x={edges.map((e) => e.x).reduce((p, v) => Math.min(p, v)) + 10}
        y={edges.map((e) => e.y).reduce((p, v) => p + v / edges.length, 0)}
        applyCache
      />
      {claimer && (
        <Text
          ref={(node) => node && node.cache()}
          align={"center"}
          text={claimer}
          x={edges.map((e) => e.x).reduce((p, v) => Math.min(p, v)) + 10}
          y={edges.map((e) => e.y).reduce((p, v) => p + v / edges.length, 0) + 20}
          applyCache
        />
      )}
    </>
  );
};

const CanvasMap = () => {
  if (typeof window === "undefined") return null;

  const { zones } = useZones();
  const [bounds, setBounds] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { width, height } = bounds;

  console.log(zones);

  useEffect(() => {
    const listener = window.addEventListener("resize", () => {
      setBounds({ width: window.innerWidth, height: window.innerHeight });
    });
    return () => window.removeEventListener("resize", listener);
  }, []);

  return (
    <Stage width={width} height={height} dragBoundFunc={stageBoundsFunc} draggable transformsEnabled="position">
      <Layer>
        <MapImage />
      </Layer>

      {zones && (
        <Layer>
          {zones.map((zone) => (
            <Zone edges={zone.shape.edges} bounds={bounds} {...zone} />
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
