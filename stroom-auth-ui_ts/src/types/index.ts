export interface HasUuid {
  uuid: string;
}

export interface HasAuditInfo {
  createTimeMs: number;
  updateTimeMs: number;
  createUser: string;
  updateUser: string;
}

export interface User extends HasUuid {
  name: string;
  isGroup: boolean;
}

export interface IndexVolumeGroup extends HasAuditInfo {
  name: string;
}

export interface IndexVolume extends HasAuditInfo {
  id: string; // it's a number on the server side, but so many things will be easier if we just treat as string in JS
  path: string;
  nodeName: string;
  bytesLimit: number;
  bytesUsed: number;
  bytesFree: number;
  bytesTotal: number;
  statusMs: number;
}

export interface IndexVolumeGroupMembership {
  volumeId: string;
  groupName: string;
}

export interface DocRefType extends HasUuid {
  type: string;
  name?: string;
}

export const copyDocRef = (input: DocRefType): DocRefType => {
  return {
    uuid: input.uuid,
    type: input.type,
    name: input.name,
  };
};

export interface DocRefInfoType {
  docRef: DocRefType;
  createTime: number;
  updateTime: number;
  createUser: string;
  updateUser: string;
  otherInfo: string;
}

export interface Tree<T> {
  children?: (T & Tree<T>)[];
}

export interface DocRefTree extends DocRefType, Tree<DocRefType> {}

export interface TWithLineage<T extends HasUuid> {
  node: Tree<T> & T;
  lineage: T[];
}

export type DocRefWithLineage = TWithLineage<DocRefType>;

export type DocRefConsumer = (d: DocRefType) => void;

export interface SelectOptionType {
  value: string;
  label: string;
}

export type SelectOptionsType = SelectOptionType[];

export interface OptionType {
  text: string;
  value: string;
}

export interface DocumentType<T extends string> extends HasUuid {
  type: T;
  name?: string;
}

export interface Dictionary extends DocumentType<"Dictionary"> {
  description?: string;
  data?: string;
  imports?: DocRefType[];
}

export type IndexFieldType = "FIELD" | "NUMERIC_FIELD" | "DATE_FIELD" | "ID";

export const IndexFieldTypeDisplayValues = {
  FIELD: "Text",
  NUMERIC_FIELD: "Number",
  DATE_FIELD: "Date",
  ID: "Id",
};

export type AnalyzerType =
  | "KEYWORD"
  | "ALPHA"
  | "NUMERIC"
  | "ALPHA_NUMERIC"
  | "WHITESPACE"
  | "STOP"
  | "STANDARD";

export const AnalyzerDisplayValues = {
  KEYWORD: "Keyword",
  ALPHA: "Alpha",
  NUMERIC: "Numeric",
  ALPHA_NUMERIC: "Alpha numeric",
  WHITESPACE: "Whitespace",
  STOP: "Stop words",
  STANDARD: "Standard",
};

export type FeedStatus = "Receive" | "Reject" | "Drop";

export interface FeedDoc extends DocumentType<"Feed"> {
  description?: string;
  classification?: string;
  encoding?: string;
  contextEncoding?: string;
  retentionDayAge?: number;
  reference?: boolean;
  streamType?: string;
  feedStatus?: FeedStatus;
}
export interface AnnotationsIndexDoc extends DocumentType<"AnnotationsIndex"> {
  description?: string;
}
export interface ElasticIndexDoc extends DocumentType<"ElasticIndex"> {
  indexName?: string;
  indexedType?: string;
}
export interface DashboardDoc extends DocumentType<"Dashboard"> {
  description?: string;
}
export interface ScriptDoc extends DocumentType<"Script"> {
  description?: string;
  dependencies?: DocRefType[];
  data?: string;
}

export type StatisticType = "Count" | "Value";
export type StatisticRollupType = "None" | "All" | "Custom";
export interface StatisticField {
  fieldName: string;
}
export interface CustomRollupMask {
  rolledUpTagPositions: number[];
}
export interface StatisticsDataSourceData {
  statisticFields: StatisticField[];
  customRollUpMasks: CustomRollupMask[];
  fieldPositionMap: {
    [fieldName: string]: number;
  };
}
export interface StatisticStoreDoc extends DocumentType<"StatisticStore"> {
  description?: string;
  statisticType?: StatisticType;
  rollUpType?: StatisticRollupType;
  precision?: number;
  enabled?: boolean;
  config?: StatisticsDataSourceData;
}
export interface StroomStatsStoreEntityData {
  statisticFields: StatisticField[];
  customRollUpMasks: CustomRollupMask[];
  fieldPositionMap: {
    [fieldName: string]: number;
  };
}
export interface StroomStatsStoreDoc extends DocumentType<"StroomStatsStore"> {
  description?: string;
  statisticType?: StatisticType;
  rollUpType?: StatisticRollupType;
  precision?: number;
  enabled?: boolean;
  config?: StroomStatsStoreEntityData;
}
export type SystemDoc = DocumentType<"System">;

export type TextConverterType = "None" | "Data Splitter" | "XML Fragment";
export interface TextConverterDoc extends DocumentType<"TextConverter"> {
  description?: string;
  data?: string;
  converterType?: TextConverterType;
}
export interface VisualisationDoc extends DocumentType<"Visualisation"> {
  description?: string;
  functionName?: string;
  scriptRef?: DocRefType;
  settings?: string;
}
export interface XMLSchemaDoc extends DocumentType<"XMLSchema"> {
  description?: string;
  namespaceURI?: string;
  systemId?: string;
  data?: string;
  deprecated?: boolean;
  schemaGroup?: string;
}

export interface IndexField {
  fieldType: IndexFieldType;
  fieldName: string;
  stored: boolean;
  indexed: boolean;
  termPositions: boolean;
  analyzerType: AnalyzerType;
  caseSensitive: boolean;
  conditions: ConditionType[];
}

export interface IndexDoc extends DocumentType<"Index"> {
  description?: string;
  volumeGroupName?: string;
  data: {
    fields: IndexField[];
  };
}

export interface XsltDoc extends DocumentType<"XSLT"> {
  description?: string;
  data?: string;
}

export type ConditionType =
  | "EQUALS"
  | "IN"
  | "IN_DICTIONARY"
  | "IS_DOC_REF"
  | "CONTAINS"
  | "BETWEEN"
  | "GREATER_THAN"
  | "GREATER_THAN_OR_EQUAL_TO"
  | "LESS_THAN"
  | "LESS_THAN_OR_EQUAL_TO";

export const ConditionDisplayValues = {
  CONTAINS: "contains",
  EQUALS: "=",
  GREATER_THAN: ">",
  GREATER_THAN_OR_EQUAL_TO: ">=",
  LESS_THAN: "<",
  LESS_THAN_OR_EQUAL_TO: "<=",
  BETWEEN: "between",
  IN: "in",
  IN_DICTIONARY: "in dictionary",
};

export interface DataSourceFieldType {
  type: "ID" | "FIELD" | "NUMERIC_FIELD" | "DATE_FIELD";
  name: string;
  queryable: boolean;
  conditions: ConditionType[];
}

export interface DataSourceType {
  fields: DataSourceFieldType[];
}

export interface ExpressionItem {
  type: "operator" | "term";
  enabled: boolean;
}

export type OperatorType = "AND" | "OR" | "NOT";
export const OperatorTypeValues: OperatorType[] = ["AND", "OR", "NOT"];

export interface ExpressionOperatorType extends ExpressionItem {
  type: "operator";
  op: OperatorType;
  children: (ExpressionTermType | ExpressionOperatorType)[];
}

export interface ExpressionTermType extends ExpressionItem {
  type: "term";
  field?: string;
  condition?: ConditionType;
  value?: any;
  dictionary?: Dictionary | null;
}

export interface ExpressionHasUuid extends ExpressionItem, HasUuid {}

export interface ExpressionOperatorWithUuid
  extends ExpressionOperatorType,
    HasUuid {
  enabled: boolean;
  children: (ExpressionOperatorWithUuid | ExpressionTermWithUuid)[];
}

export interface ExpressionTermWithUuid extends ExpressionTermType, HasUuid {}

export interface ElementDefinition {
  type: string;
  category: string;
  roles: string[];
  icon: string;
}

export type ElementDefinitions = ElementDefinition[];
export interface ElementDefinitionsByCategory {
  [category: string]: ElementDefinition[];
}
export interface ElementDefinitionsByType {
  [type: string]: ElementDefinition;
}

export interface ElementPropertyType {
  elementType: ElementDefinition;
  name: string;
  type: string;
  description: string;
  defaultValue: string;
  pipelineReference: boolean;
  docRefTypes: string[] | undefined;
  displayPriority: number;
}

export interface ElementPropertiesType {
  [propName: string]: ElementPropertyType;
}
export interface ElementPropertiesByElementIdType {
  [pipelineElementType: string]: ElementPropertiesType;
}

export interface ControlledInput<T> {
  onChange: (value: T) => any;
  value: T;
}
export interface AddRemove<T> {
  add?: T[];
  remove?: T[];
}

export interface SourcePipeline {
  pipeline: DocRefType;
}

export interface PipelineLinkType {
  from: string;
  to: string;
}

export interface PipelineReferenceType {
  element: string;
  name: string;
  pipeline: DocRefType;
  feed: DocRefType;
  streamType: string;
  source: SourcePipeline;
}

export interface PipelinePropertyValue {
  string?: string | null;
  integer?: number | null;
  long?: number | null;
  boolean?: boolean | null;
  entity?: DocRefType | null;
}

export interface PipelinePropertyType {
  source?: SourcePipeline;
  element: string;
  name: string;
  value: PipelinePropertyValue;
}

export interface PipelineSearchCriteriaType {
  filter: string;
  pageOffset: number;
  pageSize: number;
}

export interface PipelineSearchResultType {
  total: number;
  pipelines: DocRefType[];
}

export interface PipelineElementType {
  id: string;
  type: string;
}

export interface PipelineDataType {
  elements: AddRemove<PipelineElementType>;
  properties: AddRemove<PipelinePropertyType>;
  pipelineReferences: AddRemove<PipelineReferenceType>;
  links: AddRemove<PipelineLinkType>;
}

export interface PageRequest {
  pageOffset?: number;
  pageSize?: number;
}

export interface PipelineDocumentType extends DocumentType<"Pipeline"> {
  description?: string;
  parentPipeline?: DocRefType;
  configStack: PipelineDataType[];
  merged: PipelineDataType;
}

export interface PipelineAsTreeType {
  uuid: string;
  type: string;
  children: PipelineAsTreeType[];
}

export interface PageResponse {
  offset: number;
  length: number;
  total: number;
  exact: boolean;
}

export type DataStatus = "UNLOCKED" | "LOCKED" | "DELETED";

export interface DataItem {
  id: number;
  feedName: string;
  typeName: string;
  pipelineUuid: string;
  parentDataId: number;
  processTaskId: number;
  processorId: number;
  status: DataStatus;
  statusMs: number;
  createMs: number;
  effectiveMs: number;
}

export interface DataRow {
  data: DataItem;
  attributes?: {
    [key: string]: string;
  };
}

export interface StreamAttributeMapResult {
  pageResponse: PageResponse;
  streamAttributeMaps: DataRow[];
}

export enum PermissionInheritance {
  NONE = "None",
  SOURCE = "Source",
  DESTINATION = "Destination",
  COMBINED = "Combined",
}

export interface PermissionsByUuid {
  [userUuid: string]: string[];
}

export interface DocumentPermissions {
  document: DocRefType;
  byUser: PermissionsByUuid;
}

export interface OffsetRange {
  offset: number;
  length: number;
}
export interface RowCount {
  count: number;
  exact: boolean;
}

export interface AbstractFetchDataResult {
  streamType: string;
  classification: string;
  streamRange: OffsetRange;
  streamRowCount: RowCount;
  pageRange: OffsetRange;
  pageRowCount: RowCount;
  availableChildStreamType: string[];
}

export type Severity = "INFO" | "WARN" | "ERROR" | "FATAL";

export interface Marker {
  severity: Severity;
}
export interface FetchMarkerResult extends AbstractFetchDataResult {
  markers: Marker[];
}

export interface FetchDataResult extends AbstractFetchDataResult {
  data: string;
  html: boolean;
}

export interface LimitsType {
  streamCount: number;
  eventCount: number;
  durationMs: number;
}

export interface QueryDataType {
  dataSource: DocRefType;
  expression: ExpressionOperatorType;
  limits?: LimitsType;
}

export interface StreamTaskType {
  // Most important data, probably
  filterName: string;
  pipelineName: string;
  pipelineId: number;
  trackerMs: number;
  trackerPercent: number;
  lastPollAge: string;
  taskCount: number;
  priority: number;
  streamCount: number;
  eventCount: number;
  status: string;
  enabled: boolean;
  filter: QueryDataType;

  // supporting data
  filterId?: number;
  createUser?: string;
  createdOn?: number;
  updateUser?: string;
  updatedOn?: number;
  minStreamId?: number;
  minEventId?: number;
}

export interface StreamTasksResponseType {
  streamTasks: StreamTaskType[];
  totalStreamTasks: number;
}

export interface StyledComponentProps {
  className?: string;
}

export enum Direction {
  UP = "up",
  DOWN = "down",
}
