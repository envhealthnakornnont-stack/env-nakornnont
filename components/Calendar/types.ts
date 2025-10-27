export type ViewMode = "MONTH" | "WEEK" | "AGENDA";

export type UpcomingProps = {
  icsUrl: string;
  limit?: number;
  className?: string;
};

export type VEvent = {
  uid?: string;
  summary?: string;
  description?: string;
  location?: string;
  url?: string;
  start: Date;
  end?: Date;
  allDay: boolean;
};