import { Svg, SvgProps, Path } from "react-native-svg";

const PikaLogoutLeft = ({ color, ...props }: SvgProps) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      opacity="0.28"
      d="M3.15739 11.5564C3.93322 10.599 4.82454 9.74024 5.81153 9C5.71163 9.99392 5.55031 10.9991 5.55031 12C5.55031 13.0009 5.71163 14.0061 5.81153 15C4.82454 14.2598 3.93322 13.401 3.15739 12.4436C3.05246 12.3141 3 12.157 3 12C3 11.843 3.05246 11.6859 3.15739 11.5564Z"
      fill={color}
    />
    <Path
      d="M11 4.52779C12.0615 3.57771 13.4633 3 15 3C18.3137 3 21 5.68629 21 9V15C21 18.3137 18.3137 21 15 21C13.4633 21 12.0615 20.4223 11 19.4722"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.55031 12H16M5.55031 12C5.55031 10.9991 5.71163 9.99392 5.81153 9C4.82454 9.74024 3.93322 10.599 3.15739 11.5564C3.05246 11.6859 3 11.843 3 12C3 12.157 3.05246 12.3141 3.15739 12.4436C3.93322 13.401 4.82454 14.2598 5.81153 15C5.71163 14.0061 5.55031 13.0009 5.55031 12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PikaLogoutLeft;
