import { Svg, SvgProps, Path } from "react-native-svg";

const PikaChevronDown = ({ color, ...props }: SvgProps) => (
  <Svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path
      d="M8.5 10.1392C9.56206 11.601 10.8071 12.9104 12.2021 14.0334C12.3774 14.1744 12.6226 14.1744 12.7979 14.0334C14.1929 12.9104 15.4379 11.601 16.5 10.1392"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PikaChevronDown;
