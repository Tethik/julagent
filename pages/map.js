import Head from "next/head";
import { useState } from "react";
import { Stage, Layer, Image, Text, Rect } from "react-konva";
import useImage from "use-image";
import Layout from "../components/layout";

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

const CanvasMap = () => {
  if (typeof window === "undefined") return null;
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      dragBoundFunc={stageBoundsFunc}
      onClick={(e) => console.log(e)}
      onMouseMove={(e) => {
        const pos = e.currentTarget.getPointerPosition();
        requestAnimationFrame(() => setPos(pos));
      }}
      draggable
    >
      <Layer>
        <MapImage />
      </Layer>
      <Layer>
        <Rect width={window.innerHeight} height={window.innerHeight} />
      </Layer>
      <Layer>
        <Rect width={100} height={50} />
        <Text text={JSON.stringify(pos)} />
      </Layer>
    </Stage>
  );
};

export default function Map() {
  const fakeUsers = ["Elise", "Julian", "Sally", "Siri"];

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
