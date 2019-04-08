import {
  DocRefTree,
  ElementDefinitions,
  ElementPropertiesByElementIdType,
  DataSourceType,
  StreamTaskType,
  User,
  IndexVolume,
  IndexVolumeGroup,
  IndexVolumeGroupMembership,
  StreamAttributeMapResult,
  DocumentType,
} from "../types";

export interface UserGroupMembership {
  userUuid: string;
  groupUuid: string;
}

export interface UserDocPermission {
  userUuid: string;
  docRefUuid: string;
  permissionName: string;
}

export interface TestData {
  docRefTypes: string[];
  documentTree: DocRefTree;
  elements: ElementDefinitions;
  elementProperties: ElementPropertiesByElementIdType;
  trackers: StreamTaskType[];
  dataList: StreamAttributeMapResult;
  dataSource: DataSourceType;
  usersAndGroups: {
    users: User[];
    userGroupMemberships: UserGroupMembership[];
  };
  indexVolumesAndGroups: {
    volumes: IndexVolume[];
    groups: IndexVolumeGroup[];
    groupMemberships: IndexVolumeGroupMembership[];
  };
  allAppPermissions: string[];
  userAppPermissions: {
    [userUuid: string]: string[];
  };
  docPermissionByType: {
    [docType: string]: string[];
  };
  userDocPermission: UserDocPermission[];
}
