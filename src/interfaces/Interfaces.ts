export interface TableName {
  TABLE_NAME: string;
  TABLE_TYPE: "TABLE" | "SYSTEM TABLE" | "ACCESS TABLE" | "VIEW";
}

export interface Columns {
  NAME: string;
  TYPE: number;
  DESC: string;
}

export type GenericObject = Record<string, unknown>;

export interface TableContents {
  TABLE_NAME: string;
  TABLE_CONTENT: GenericObject[];
  TABLE_ROWS: number;
}

export interface ReadEvents {
  onTableRead?: (data: TableContents) => void;
  onStart?: (tables: string[]) => void;
  onEnd?: (result: TableContents[]) => void;
}
