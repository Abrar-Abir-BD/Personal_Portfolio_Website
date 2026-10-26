import { IconType } from "react-icons";
import {
  SiAdobeaftereffects,
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiArduino,
  SiAutodesk,
  SiC,
  SiCplusplus,
  SiDassaultsystemes,
  SiDavinciresolve,
  SiEspressif,
  SiFigma,
  SiGit,
  SiJavascript,
  SiJupyter,
  SiNvidia,
  SiOpencv,
  SiPython,
  SiPytorch,
  SiRaspberrypi,
  SiReact,
  SiRos,
  SiStmicroelectronics,
  SiTensorflow,
  SiUnity,
} from "react-icons/si";
import {
  TbBrandOffice,
  TbCpu,
  TbCube3dSphere,
  TbFocus2,
  TbMathFunction,
  TbPalette,
  TbRobot,
  TbWaveSine,
} from "react-icons/tb";

// Logo + brand colour for each skill, by the "icon" key in skills.json.
// "currentColor" is used where the brand colour is too dark to read on the
// page, so the logo follows the text colour instead.
// No official logo is available for YOLO, MATLAB or Simulink (generic
// symbols stand in), Fusion (Autodesk's logo), SolidWorks (its maker,
// Dassault Systèmes) or Microsoft Office (a generic Office icon).
export const skillIcons: Record<string, { Icon: IconType; color: string }> = {
  python: { Icon: SiPython, color: "#4B8BBE" },
  cpp: { Icon: SiCplusplus, color: "#659AD2" },
  c: { Icon: SiC, color: "#A8B9CC" },
  pytorch: { Icon: SiPytorch, color: "#EE4C2C" },
  tensorflow: { Icon: SiTensorflow, color: "#FF8F00" },
  opencv: { Icon: SiOpencv, color: "#8C6BFF" },
  yolo: { Icon: TbFocus2, color: "#00D4FF" },
  jupyter: { Icon: SiJupyter, color: "#F37626" },
  git: { Icon: SiGit, color: "#F05032" },
  jetson: { Icon: SiNvidia, color: "#76B900" },
  raspberrypi: { Icon: SiRaspberrypi, color: "#C51A4A" },
  stm32: { Icon: SiStmicroelectronics, color: "#3CB4E6" },
  esp32: { Icon: SiEspressif, color: "#E7352C" },
  arduino: { Icon: SiArduino, color: "#00979D" },
  ros: { Icon: SiRos, color: "currentColor" },
  fusion: { Icon: SiAutodesk, color: "#FF6B00" },
  solidworks: { Icon: SiDassaultsystemes, color: "#E2231A" },
  matlab: { Icon: TbMathFunction, color: "#E16737" },
  simulink: { Icon: TbWaveSine, color: "#3D8FD1" },
  unity: { Icon: SiUnity, color: "currentColor" },
  figma: { Icon: SiFigma, color: "#F24E1E" },
  illustrator: { Icon: SiAdobeillustrator, color: "#FF9A00" },
  photoshop: { Icon: SiAdobephotoshop, color: "#31A8FF" },
  aftereffects: { Icon: SiAdobeaftereffects, color: "#9999FF" },
  davinci: { Icon: SiDavinciresolve, color: "currentColor" },
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  react: { Icon: SiReact, color: "#61DAFB" },
  office: { Icon: TbBrandOffice, color: "#EB3C00" },
};

// Category header icons, by the "icon" key on each group in skills.json
export const categoryIcons: Record<string, { Icon: IconType; color: string }> = {
  "cat-ai": { Icon: TbCpu, color: "#4FD1E8" },
  "cat-robotics": { Icon: TbRobot, color: "#FF7A45" },
  "cat-cad": { Icon: TbCube3dSphere, color: "#8C9EFF" },
  "cat-design": { Icon: TbPalette, color: "#4FD1E8" },
};
