/** Gender values used by the demo user management page. */
export type UserGender = 1 | 2;

/** Enable-status values used by the demo user management page. */
export type UserStatus = 1 | 2;

/** Operation mode of the user add/edit drawer. */
export type UserOperateType = 'add' | 'edit';

/** One row of the demo user table. */
export interface UserRecord {
  readonly id: number;
  username: string;
  nickname: string;
  userGender: UserGender;
  userPhone: string;
  userEmail: string;
  status: UserStatus;
  /** Role codes, resolved through the role label map. */
  roles: string[];
  createTime: string;
}

/** Filter model of the user search form. Empty strings / null mean "no filter". */
export interface UserSearchParams {
  username: string;
  nickname: string;
  userGender: UserGender | null;
  userPhone: string;
  userEmail: string;
  status: UserStatus | null;
}

/** Values edited in the add/edit drawer. */
export interface UserFormModel {
  username: string;
  nickname: string;
  userGender: UserGender;
  userPhone: string;
  userEmail: string;
  userRoleCodes: string[];
  status: UserStatus;
}

/** Payload emitted by the add/edit drawer. */
export interface UserSavePayload {
  readonly operateType: UserOperateType;
  readonly user: UserFormModel;
}
