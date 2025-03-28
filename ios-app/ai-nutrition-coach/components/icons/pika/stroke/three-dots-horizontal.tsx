import { Svg, SvgProps, Path } from "react-native-svg";

const PikaThreeDotsHorizontal = ({ color = '#000', ...props }: SvgProps) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
>
  <Path
    d="M6 12C6 12.5523 5.55228 13 5 13C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11C5.55228 11 6 11.4477 6 12Z"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <Path
    d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <Path
    d="M20 12C20 12.5523 19.5523 13 19 13C18.4477 13 18 12.5523 18 12C18 11.4477 18.4477 11 19 11C19.5523 11 20 11.4477 20 12Z"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</Svg>
);

export default PikaThreeDotsHorizontal;
