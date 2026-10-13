import * as React from 'react';
export type IconName =
  | "OutlineFilesBook"
  | "OutlineFilesClipboard"
  | "OutlineFilesDocument"
  | "OutlineGeneralCalendar"
  | "OutlineGeneralChartPie"
  | "OutlineGeneralFilter"
  | "OutlineGeneralFlask"
  | "OutlineGeneralPulse"
  | "OutlineInterfaceCheck"
  | "OutlineInterfaceColumns"
  | "OutlineInterfaceEdit"
  | "OutlineInterfaceExchange"
  | "OutlineInterfaceLayout"
  | "OutlineInterfaceSearch"
  | "OutlineNavigationExplore"
  | "OutlineStatusAward"
  | "OutlineStatusBookOpen"
  | "OutlineStatusCheckedBox"
  | "OutlineStatusInfoCircle"
  | "OutlineStatusInfoTriangle"
  | "OutlineStatusLightbulb"
  | "OutlineStatusLightning"
  | "OutlineStatusLock"
  | "SolidGeneralChartPie"
  | "SolidGeneralFilter"
  | "SolidGeneralFlask"
  | "SolidInterfaceCheck"
  | "SolidInterfaceEdit"
  | "SolidInterfaceSearch"
  | "SolidStatusCheckedBox"
  | "SolidStatusInfoCircle"
  | "SolidStatusInfoTriangle"
  | "SolidStatusLightbulb"
  | "SolidStatusLightning"
  | "SolidStatusLock";
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
}
export declare const Icon: React.FC<IconProps>;
export default Icon;
