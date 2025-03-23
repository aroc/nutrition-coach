import { Svg, SvgProps, Path } from "react-native-svg";

const PikaCross = ({ color, ...props }: SvgProps) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M6 18L12 12M12 12L18 6M12 12L6 6M12 12L18 18"
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);

export default PikaCross;
