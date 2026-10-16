import React, { useEffect, useState } from "react";
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

// Carrega um JSON Lottie de public/lottie e o sincroniza com o frame do Remotion
export const LottieAsset: React.FC<{
  name: string;
  style?: React.CSSProperties;
  loop?: boolean;
  playbackRate?: number;
}> = ({ name, style, loop = false, playbackRate = 1 }) => {
  const [handle] = useState(() => delayRender(`Lottie ${name}`));
  const [data, setData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(staticFile(`lottie/${name}.json`))
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [handle, name]);

  if (!data) return null;
  return <Lottie animationData={data} loop={loop} playbackRate={playbackRate} style={style} />;
};
