import { Svg, SvgProps, Path } from "react-native-svg";

const PauseIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M7.5 6.8c0-.8.6-1.3 1.3-1.3h.4c.7 0 1.3.5 1.3 1.3v10.4c0 .8-.6 1.3-1.3 1.3h-.4c-.7 0-1.3-.5-1.3-1.3V6.8zM13.5 6.8c0-.8.6-1.3 1.3-1.3h.4c.7 0 1.3.5 1.3 1.3v10.4c0 .8-.6 1.3-1.3 1.3h-.4c-.7 0-1.3-.5-1.3-1.3V6.8z"
      fill={color}
    />
  </Svg>
);

export default PauseIcon;
