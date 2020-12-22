import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Text, Rect, Shape, Circle } from "react-konva";
import useImage from "use-image";
import Layout from "../components/layout";
import useZones from "../client/swr/useZones";
import { useRouter } from "next/router";
import useMe from "../client/swr/useMe";

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

function colorForZone({ claimed, discovery_date }) {
  if (claimed) {
    return "#0000FF";
  }
  if (!claimed && discovery_date) {
    return "#FF0000";
  }
  return "#333333";
}

const Zone = ({ shape, claimer, claimed, name, discovery_date }) => {
  const color = colorForZone({ claimed, discovery_date });
  const { edges } = shape;

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
        fill={color}
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

const CanvasMap = ({ showZone }) => {
  if (typeof window === "undefined") return null;

  const { zones } = useZones();
  const { user } = useMe();
  const [bounds, setBounds] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { width, height } = bounds;
  const stageRef = useRef();
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    const listener = window.addEventListener("resize", () => {
      setBounds({ width: window.innerWidth, height: window.innerHeight });
    });

    return () => window.removeEventListener("resize", listener);

    // const ro = new ResizeObserver((entries) => {
    //   for (let entry of entries) {
    //     setBounds({ width: entry.contentRect.width, height: entry.contentRect.height });
    //   }
    // });

    // const el = document.querySelector("#canvas");
    // setBounds({ width: el.innerWidth, height: el.innerHeight });
    // ro.observe(document.querySelector("#canvas"));
    // return () => ro.disconnect();
  }, []);

  // Not sure how to move view to show specific zone
  // useEffect(() => {
  //   console.log(showZone);
  //   console.log(zones);
  //   console.log(stageRef.current);
  //   if (showZone && zones && stageRef.current) {
  //     const zone = zones.find((z) => {
  //       console.log(z.id, showZone, z);
  //       return z.id == showZone;
  //     });
  //     console.log(zone);

  //     if (!zone) return;
  //     const { x, y } = zone.shape.edges[0];

  //     // stageRef.current.position({ x, y });

  //     // stageRef.current.offsetX(x);
  //     // stageRef.current.offsetX(y);
  //   }
  // }, [showZone, zones, stageRef.current]);

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      dragBoundFunc={stageBoundsFunc}
      draggable
      transformsEnabled="position"
      onWheel={() => setScale(scale * 0.1)}
      scale={scale}
    >
      <Layer>
        <MapImage />
      </Layer>

      {zones && (
        <Layer>
          {zones.map((zone) => (
            <Zone key={`zone-${zone.id}`} claimed={user && zone.claimer === user.name} {...zone} />
          ))}
        </Layer>
      )}
    </Stage>
  );
};

export default function Map() {
  const router = useRouter();

  const { zone } = router.query;

  return (
    <Layout>
      <Head>
        <title>Karta</title>
      </Head>

      <div id="canvas" style={{ width: "100%", height: "100%" }}>
        <CanvasMap showZone={zone} />
      </div>
    </Layout>
  );
}
