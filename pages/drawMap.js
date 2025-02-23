import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Text, Rect, Shape, Circle } from "react-konva";
import useImage from "use-image";
import Layout from "../components/layout";
import useZones from "../client/swr/fetcher";

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

const Zone = ({ edges, bounds }) => {
  const shapeRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    shapeRef.current && shapeRef.current.cache({ ...edges[0], ...bounds });
  }, [shapeRef, bounds, edges]);

  useEffect(() => {
    textRef.current && textRef.current.cache();
  }, [textRef]);

  if (!edges || edges.length === 0) return null;

  return (
    <>
      <Shape
        ref={shapeRef}
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
        stroke="black"
        strokeWidth={2}
      />
      <Text
        ref={textRef}
        align={"center"}
        text={"okänd"}
        x={edges.map((e) => e.x).reduce((p, v) => Math.min(p, v)) + 10}
        y={edges.map((e) => e.y).reduce((p, v) => p + v / edges.length, 0)}
      />
    </>
  );
};

const CanvasMap = () => {
  if (typeof window === "undefined") return null;

  // const { user, isLoading, isError } = useZones();

  // const [zones, setZones] = useState([]);
  const [zone, setZone] = useState({ shape: { edges: [] } });
  const [newShapeEdges, setNewShapeEdges] = useState([]);
  const [drawing, setDrawing] = useState(true);
  const [bounds, setBounds] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { width, height } = bounds;

  const scale = 1.0;

  const canvasClick = (e) => {
    const pointerPos = e.currentTarget.getPointerPosition();
    const mousePointTo = {
      x: pointerPos.x / scale - e.currentTarget.attrs.x / scale,
      y: pointerPos.y / scale - e.currentTarget.attrs.y / scale,
    };
    setNewShapeEdges([...newShapeEdges, mousePointTo]);
  };

  useEffect(() => {
    const listener = window.addEventListener("resize", () => {
      setBounds({ width: window.innerWidth, height: window.innerHeight });
    });
    return () => window.removeEventListener("resize", listener);
  }, []);

  console.log(JSON.stringify(zone));

  return (
    <>
      <Stage
        width={width}
        height={height}
        dragBoundFunc={stageBoundsFunc}
        onClick={(e) => drawing && canvasClick(e)}
        draggable
      >
        <Layer>
          <MapImage />
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
          <Zone edges={zone.shape.edges} bounds={bounds} />

          {newShapeEdges.length > 0 && (
            <Shape
              key={"new-shape"}
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
              key={edge}
              x={edge.x}
              y={edge.y}
              width={20}
              fill={"black"}
              onClick={() => {
                if (newShapeEdges.length < 3) return;
                setNewShapeEdges([]);
                setZone({ name: "something", shape: { edges: newShapeEdges } });
              }}
            />
          ))}
        </Layer>
      </Stage>
    </>
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
