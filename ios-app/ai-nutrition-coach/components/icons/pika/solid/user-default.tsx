import { Svg, SvgProps, Path } from "react-native-svg";

const PikaUserDefault = ({ color, ...props }: SvgProps) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2Z"
      fill={color}
    />
    <Path
      d="M8 14C5.23858 14 3 16.2386 3 19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19C21 16.2386 18.7614 14 16 14H8Z"
      fill={color}
    />
  </Svg>
);

export default PikaUserDefault;
