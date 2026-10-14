export interface PointWeights {
  on_time: number;
  late: number;
  missing: number;
  attendance: number;
}

export interface SiteSettings {
  site_title: string;
  point_weights: PointWeights;
  contact_email: string;
  contact_wa: string;
  contact_ig: string;
}

export interface Setting {
  key: string;
  value: string;
  updatedAt: Date;
}
