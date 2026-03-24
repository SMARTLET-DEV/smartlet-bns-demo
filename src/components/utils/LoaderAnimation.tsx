import React from "react";
import Lottie from "lottie-react";
import animation from "@/assets/animation.json";

type LoaderAnimationProps = Omit<React.ComponentProps<typeof Lottie>, "animationData"> & {
  style?: React.CSSProperties;
};

const LoaderAnimation: React.FC<LoaderAnimationProps> = ({ style, ...props }) => (
  <Lottie
    animationData={animation}
    loop
    style={style || { width: 300, height: 300 }}
    {...props}
  />
);

export default LoaderAnimation;
