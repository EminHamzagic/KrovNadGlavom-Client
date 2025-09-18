export enum OrientationEnum {
  North = "north",
  South = "south",
  East = "east",
  West = "west",
  Northeast = "northeast",
  Northwest = "northwest",
  Southeast = "southeast",
  Southwest = "southwest",
}

export function getOrientationLabel(orientation: string | undefined): string {
  switch (orientation?.toLocaleLowerCase()) {
    case OrientationEnum.North:
      return "Sever";
    case OrientationEnum.South:
      return "Jug";
    case OrientationEnum.East:
      return "Istok";
    case OrientationEnum.West:
      return "Zapad";
    case OrientationEnum.Northeast:
      return "Severoistok";
    case OrientationEnum.Northwest:
      return "Severozapad";
    case OrientationEnum.Southeast:
      return "Jugoistok";
    case OrientationEnum.Southwest:
      return "Jugozapad";
    default:
      return orientation ?? "";
  }
}
