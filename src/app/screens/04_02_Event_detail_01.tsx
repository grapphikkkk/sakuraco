import { EventDetail01 } from "./01_04_Event_detail_01";

/**
 * Special Event Detail screen wrapper.
 * 
 * This is a thin wrapper that reuses the existing EventDetail01 component,
 * which already supports special slot events (eventId starting with "special-").
 * 
 * This file exists to keep naming conventions clear (04_02_Event_detail_01)
 * while avoiding code duplication.
 */
export function SpecialEventDetail() {
  return <EventDetail01 />;
}
