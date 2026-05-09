export type ID = number | string;

export type Status = "active" | "inactive" | "draft" | "blocked" | "suspended";

export type ApiListResponse<T> = {
  data: T[];
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
  };
};

export type ApiResourceResponse<T> = {
  data: T;
};

export type SelectOption = {
  label: string;
  value: string;
};

export type DateRange = {
  from?: string;
  to?: string;
};
