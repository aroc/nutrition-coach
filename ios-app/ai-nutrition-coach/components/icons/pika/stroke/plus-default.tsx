import { Svg, SvgProps, Path } from "react-native-svg";

const PikaPlusDefault = ({ color, ...props }: SvgProps) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M12 19V12M12 12V5M12 12L5 12M12 12L19 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PikaPlusDefault;
