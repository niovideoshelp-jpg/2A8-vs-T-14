import React from "react";
import { Composition, Folder } from "remotion";
import { Intro } from "./Intro";
import { Chapter, chapterFrames } from "./kit/Chapter";
import { CHAPTERS } from "./chapters";
import { FPS, HEIGHT, WIDTH } from "./theme";
import { TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Intro"
      component={Intro}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ stem: "all" as const }}
    />
    <Folder name="Capitulos">
      {CHAPTERS.map((def) => (
        <Composition
          key={def.id}
          id={def.id}
          component={Chapter}
          durationInFrames={chapterFrames(def)}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={{ def }}
        />
      ))}
    </Folder>
  </>
);
