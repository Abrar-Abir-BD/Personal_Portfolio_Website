import { ComponentType } from "react";
import {
  AU,
  BD,
  CN,
  ID,
  IN,
  KR,
  PH,
  SE,
  US,
} from "country-flag-icons/react/3x2";

// Flags by the country at the end of a location ("Busan, South Korea");
// add a country here when an award, talk or role from a new one comes in
export const flags: Record<string, ComponentType<{ title?: string }>> = {
  Australia: AU,
  Bangladesh: BD,
  China: CN,
  India: IN,
  Indonesia: ID,
  Philippines: PH,
  "South Korea": KR,
  Sweden: SE,
  USA: US,
};

export const countryOf = (location: string) =>
  location.replace(/^Based in\s+/i, "").split(",").pop()?.trim() ?? "";
