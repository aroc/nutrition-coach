import { Svg, SvgProps, Path } from "react-native-svg";

interface SunsetIconProps extends SvgProps {
  size?: number;
}

const SunsetIcon: React.FC<SunsetIconProps> = ({ size = 24, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M12 3V5M5.31412 7.31412L3.8999 5.8999M18.6858 7.31412L20.1 5.8999M6 15C6 11.6863 8.68629 9 12 9C15.3137 9 18 11.6863 18 15M22 15H2M19 19H5" stroke={props.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default SunsetIcon;