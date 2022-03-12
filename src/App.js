import React, { useEffect, useRef } from "react";
import * as MB from "mathbox";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const doMathboxStuff = (containerElement) => {
  const mathbox = MB.mathBox({
    plugins: ["core", "controls", "cursor"],
    controls: {
      klass: OrbitControls,
    },
    element: containerElement,
  });
  const three = mathbox.three;

  three.camera.position.set(0, 0, 3);
  three.renderer.setClearColor(new THREE.Color(0xffffff), 1.0);

  const view = mathbox
    .set({
      focus: 3,
    })
    .cartesian({
      range: [
        [-2, 2],
        [-1, 1],
        [-1, 1],
      ],
      scale: [2, 1, 1],
    });

  view.axis({
    detail: 30,
  });

  view.axis({
    axis: 2,
  });

  view.scale({
    divide: 10,
  });
  view.ticks({
    classes: ["foo", "bar"],
    width: 2,
  });

  view.grid({
    divideX: 30,
    width: 1,
    opacity: 0.5,
    zBias: -5,
  });

  view.interval({
    id: "sampler",
    width: 64,
    expr: function (emit, x, i, t) {
      const y = Math.sin(x + t) * 0.7; // + (i%2)*Math.sin(x * 400000 + t * 5 + x * x * 10000)*.05;
      emit(x, y);
    },
    channels: 2,
  });

  view.line({
    points: "#sampler",
    color: 0x3090ff,
    width: 5,
  });

  view
    .transform({
      position: [0, 0.1, 0],
    })
    .line({
      points: "#sampler",
      color: 0x3090ff,
      width: 5,
      stroke: "dotted",
    });

  view
    .transform({
      position: [0, -0.1, 0],
    })
    .line({
      points: "#sampler",
      color: 0x3090ff,
      width: 5,
      stroke: "dashed",
    });
  return mathbox;
};

function App() {
  const container = useRef(null);
  useEffect(() => {
    const mathbox = doMathboxStuff(container.current);
    return () => {
      // I am surprised there is no mathbox.destroy() top-level API!
      // We should make one
      mathbox.remove("*");
      mathbox.three.destroy();
    };
  }, []);
  return (
    <div
      style={{ width: 500, height: 500, border: "1pt solid red" }}
      ref={container}
    />
  );
}

export default App;
