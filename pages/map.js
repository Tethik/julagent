import Head from "next/head";
import { useEffect, useState } from "react";
import { Stage, Layer, Image, Text, Rect, Shape, Circle } from "react-konva";
import useImage from "use-image";
import Layout from "../components/layout";

const MAP_HEIGHT = 1024;
const MAP_WIDTH = 1024;

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

const staticShapes = [
  {
    edges: [
      { x: 230, y: 208 },
      { x: 226, y: 283 },
      { x: 306, y: 270 },
      { x: 301, y: 207 },
    ],
  },
  {
    edges: [
      { x: 168, y: 266 },
      { x: 212, y: 269 },
      { x: 217, y: 314 },
      { x: 173, y: 293 },
    ],
  },
  {
    edges: [
      { x: 409, y: 215 },
      { x: 405, y: 307 },
      { x: 487, y: 306 },
      { x: 492, y: 221 },
    ],
  },
  {
    edges: [
      { x: 505, y: 460 },
      { x: 557, y: 461 },
      { x: 557, y: 516 },
      { x: 508, y: 513 },
    ],
  },
  {
    edges: [
      { x: 836, y: 162 },
      { x: 831, y: 237 },
      { x: 908, y: 235 },
      { x: 911, y: 164 },
    ],
  },
  {
    edges: [
      { x: 593, y: 166 },
      { x: 640, y: 163 },
      { x: 640, y: 102 },
      { x: 601, y: 104 },
    ],
  },
  {
    edges: [
      { x: 894, y: 400 },
      { x: 888, y: 508 },
      { x: 987, y: 521 },
      { x: 981, y: 400 },
    ],
  },
  {
    edges: [
      { x: 835, y: 624 },
      { x: 926, y: 628 },
      { x: 921, y: 705 },
      { x: 833, y: 697 },
    ],
  },
  {
    edges: [
      { x: 669, y: 647 },
      { x: 768, y: 645 },
      { x: 764, y: 752 },
      { x: 679, y: 744 },
    ],
  },
  {
    edges: [
      { x: 568, y: 806 },
      { x: 660, y: 803 },
      { x: 653, y: 867 },
      { x: 567, y: 870 },
    ],
  },
  {
    edges: [
      { x: 233, y: 596 },
      { x: 241, y: 506 },
      { x: 164, y: 498 },
      { x: 158, y: 587 },
    ],
  },
  {
    edges: [
      { x: 280, y: 713 },
      { x: 404, y: 708 },
      { x: 402, y: 790 },
      { x: 270, y: 784 },
    ],
  },
  {
    edges: [
      { x: 445, y: 758 },
      { x: 494, y: 755 },
      { x: 494, y: 801 },
      { x: 445, y: 794 },
    ],
  },
  {
    edges: [
      { x: 171, y: 325 },
      { x: 293, y: 312 },
      { x: 288, y: 403 },
      { x: 167, y: 401 },
    ],
  },
];

const CanvasMap = () => {
  if (typeof window === "undefined") return null;

  const [shapes, setShapes] = useState(staticShapes);
  const [newShapeEdges, setNewShapeEdges] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [{ width, height }, setBounds] = useState({ width: window.innerWidth, height: window.innerHeight });

  console.log(shapes);

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
    >
      <Layer>
        <MapImage />
      </Layer>
      <Layer>
        <Rect
          width={100}
          height={10}
          fill={"white"}
          onClick={(e) => {
            setDrawing(!drawing);
            e.cancelBubble = true;
          }}
        />
        <Text
          text={JSON.stringify({ drawing })}
          onClick={(e) => {
            setDrawing(!drawing);
            e.cancelBubble = true;
          }}
        />
      </Layer>
      <Layer>
        {shapes.map((shp) => (
          <Shape
            sceneFunc={(context, shape) => {
              context.beginPath();
              context.moveTo(shp.edges[0].x, shp.edges[0].y);
              shp.edges.slice(1).forEach((edge) => {
                context.lineTo(edge.x, edge.y);
              });
              context.closePath();
              // (!) Konva specific method, it is very important
              context.fillStrokeShape(shape);
            }}
            fill="#333333"
            opacity={0.6}
            stroke="black"
            strokeWidth={2}
          />
        ))}
      </Layer>
      <Layer>
        {newShapeEdges.length > 0 && (
          <Shape
            sceneFunc={(context, shape) => {
              context.beginPath();
              context.moveTo(newShapeEdges[0].x, newShapeEdges[0].y);
              newShapeEdges.slice(1).forEach((edge) => {
                context.lineTo(edge.x, edge.y);
              });
              context.closePath();
              // (!) Konva specific method, it is very important
              context.fillStrokeShape(shape);
            }}
            fill="#00D2FF"
            stroke="black"
            opacity={0.6}
            strokeWidth={2}
          />
        )}
        {newShapeEdges.map((edge) => (
          <Circle
            x={edge.x}
            y={edge.y}
            width={20}
            fill={"black"}
            onClick={() => {
              if (newShapeEdges.length < 3) return;
              setNewShapeEdges([]);
              setShapes([...shapes, { edges: newShapeEdges }]);
            }}
          />
        ))}
      </Layer>
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
