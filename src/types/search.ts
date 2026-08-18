/** A slice of a searchable string, flagged when it matches the active query. */
export interface SearchSegment {
  text: string;
  match: boolean;
}
