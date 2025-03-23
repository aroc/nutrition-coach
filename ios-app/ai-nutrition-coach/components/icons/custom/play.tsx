import { Svg, SvgProps, Path } from "react-native-svg";

const PlayIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M7.5 7.3c0-1.2 1.3-1.8 2.2-1.2l7.4 4.5c.9.6.9 1.9 0 2.4l-7.4 4.5c-.9.6-2.2 0-2.2-1.2V7.3z"
      fill={color}
    />
  </Svg>
);

export default PlayIcon;
