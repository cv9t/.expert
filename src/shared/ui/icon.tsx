import {
  IconFile,
  IconBuildingFactory,
  IconHospital,
  IconHome,
  IconSolarPanel,
  IconWindmill,
  TablerIconsProps,
  IconUpload,
  IconX,
  IconPlus,
} from "@tabler/icons-react";
import { ReactNode } from "react";

type IconType =
  | "file"
  | "factory"
  | "hospital"
  | "home"
  | "solar-panel"
  | "windmill"
  | "upload"
  | "x"
  | "plus";

type IconSize = "sm" | "md" | "lg";

type IconProps = Omit<TablerIconsProps, "size"> & {
  type: IconType;
  size?: IconSize;
};

const icons: { [key in IconType]: (props: TablerIconsProps) => ReactNode } = {
  file: IconFile,
  factory: IconBuildingFactory,
  hospital: IconHospital,
  home: IconHome,
  "solar-panel": IconSolarPanel,
  windmill: IconWindmill,
  upload: IconUpload,
  x: IconX,
  plus: IconPlus,
};

const iconSizes: { [key in IconSize]: string } = {
  sm: "1.125rem",
  md: "1.3rem",
  lg: "3.2rem",
};

export const Icon = ({
  type,
  size = "md",
  ...other
}: IconProps): JSX.Element => {
  const IconComponent = icons[type];
  return <IconComponent size={iconSizes[size]} stroke={2} {...other} />;
};
