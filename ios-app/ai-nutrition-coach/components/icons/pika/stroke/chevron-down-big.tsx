import { Svg, SvgProps, Path } from "react-native-svg";

const PikaChevronDownBig = ({ color, ...props }: SvgProps) => (
  <Svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path
      d="M6.5 9C8.07701 11.1808 9.92293 13.1364 11.9899 14.8172C12.2897 15.0609 12.7103 15.0609 13.0101 14.8172C15.0771 13.1364 16.923 11.1808 18.5 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PikaChevronDownBig;
