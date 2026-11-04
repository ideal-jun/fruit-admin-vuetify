import type {
  UserFormModel,
  UserGender,
  UserRecord,
  UserSearchParams,
  UserStatus,
} from '@/typings/user';

/** One gender option of the search form and the edit drawer. */
export interface UserGenderOption {
  readonly value: UserGender;
  readonly labelKey: string;
}

/** One status option of the search form and the edit drawer. */
export interface UserStatusOption {
  readonly value: UserStatus;
  readonly labelKey: string;
}

/** One role option of the edit drawer and the table role chips. */
export interface UserRoleOption {
  readonly code: string;
  readonly labelKey: string;
}

export const USER_GENDERS: readonly UserGenderOption[] = [
  { value: 1, labelKey: 'views.users.male' },
  { value: 2, labelKey: 'views.users.female' },
];

export const USER_STATUSES: readonly UserStatusOption[] = [
  { value: 1, labelKey: 'views.users.enabled' },
  { value: 2, labelKey: 'views.users.disabled' },
];

export const USER_ROLES: readonly UserRoleOption[] = [
  { code: 'super', labelKey: 'views.users.roles.super' },
  { code: 'admin', labelKey: 'views.users.roles.admin' },
  { code: 'user', labelKey: 'views.users.roles.user' },
];

/** Default (empty) search filters. */
export function createUserSearchParams(): UserSearchParams {
  return {
    username: '',
    nickname: '',
    userGender: null,
    userPhone: '',
    userEmail: '',
    status: null,
  };
}

/** Default values of the add form. */
export function createUserFormModel(): UserFormModel {
  return {
    username: '',
    nickname: '',
    userGender: 1,
    userPhone: '',
    userEmail: '',
    userRoleCodes: ['user'],
    status: 1,
  };
}

/** Role label key for a role code; unknown codes are rendered as-is. */
export function getUserRoleLabelKey(code: string): string {
  return USER_ROLES.find((role) => role.code === code)?.labelKey ?? code;
}

/** Demo rows — 18 users so the table pagination is visible. */
export function createInitialUsers(): UserRecord[] {
  return [
    {
      id: 1,
      username: 'admin',
      nickname: '超级管理员',
      userGender: 1,
      userPhone: '13800000001',
      userEmail: 'admin@fruit-admin.dev',
      status: 1,
      roles: ['super'],
      createTime: '2026-01-03 09:12:00',
    },
    {
      id: 2,
      username: 'manager',
      nickname: '运营主管',
      userGender: 2,
      userPhone: '13800000002',
      userEmail: 'manager@fruit-admin.dev',
      status: 1,
      roles: ['admin'],
      createTime: '2026-01-05 14:20:00',
    },
    {
      id: 3,
      username: 'zhangsan',
      nickname: '张三',
      userGender: 1,
      userPhone: '13800000003',
      userEmail: 'zhangsan@fruit-admin.dev',
      status: 1,
      roles: ['user'],
      createTime: '2026-01-08 10:05:00',
    },
    {
      id: 4,
      username: 'lisi',
      nickname: '李四',
      userGender: 2,
      userPhone: '13800000004',
      userEmail: 'lisi@fruit-admin.dev',
      status: 1,
      roles: ['user'],
      createTime: '2026-01-09 16:40:00',
    },
    {
      id: 5,
      username: 'wangwu',
      nickname: '王五',
      userGender: 1,
      userPhone: '13800000005',
      userEmail: 'wangwu@fruit-admin.dev',
      status: 2,
      roles: ['user'],
      createTime: '2026-01-12 08:30:00',
    },
    {
      id: 6,
      username: 'zhaoliu',
      nickname: '赵六',
      userGender: 2,
      userPhone: '13800000006',
      userEmail: 'zhaoliu@fruit-admin.dev',
      status: 1,
      roles: ['admin', 'user'],
      createTime: '2026-01-15 11:10:00',
    },
    {
      id: 7,
      username: 'sunqi',
      nickname: '孙七',
      userGender: 1,
      userPhone: '13800000007',
      userEmail: 'sunqi@fruit-admin.dev',
      status: 1,
      roles: ['user'],
      createTime: '2026-01-18 13:55:00',
    },
    {
      id: 8,
      username: 'zhouba',
      nickname: '周八',
      userGender: 2,
      userPhone: '13800000008',
      userEmail: 'zhouba@fruit-admin.dev',
      status: 2,
      roles: ['user'],
      createTime: '2026-01-21 09:45:00',
    },
    {
      id: 9,
      username: 'wujiu',
      nickname: '吴九',
      userGender: 1,
      userPhone: '13800000009',
      userEmail: 'wujiu@fruit-admin.dev',
      status: 1,
      roles: ['user'],
      createTime: '2026-01-24 15:25:00',
    },
    {
      id: 10,
      username: 'zhengshi',
      nickname: '郑十',
      userGender: 2,
      userPhone: '13800000010',
      userEmail: 'zhengshi@fruit-admin.dev',
      status: 1,
      roles: ['admin'],
      createTime: '2026-02-02 10:00:00',
    },
    {
      id: 11,
      username: 'chenxi',
      nickname: '陈曦',
      userGender: 2,
      userPhone: '13800000011',
      userEmail: 'chenxi@fruit-admin.dev',
      status: 1,
      roles: ['user'],
      createTime: '2026-02-06 14:35:00',
    },
    {
      id: 12,
      username: 'linfeng',
      nickname: '林峰',
      userGender: 1,
      userPhone: '13800000012',
      userEmail: 'linfeng@fruit-admin.dev',
      status: 2,
      roles: ['user'],
      createTime: '2026-02-11 09:20:00',
    },
    {
      id: 13,
      username: 'hejing',
      nickname: '何静',
      userGender: 2,
      userPhone: '13800000013',
      userEmail: 'hejing@fruit-admin.dev',
      status: 1,
      roles: ['user'],
      createTime: '2026-02-18 16:05:00',
    },
    {
      id: 14,
      username: 'guowei',
      nickname: '郭伟',
      userGender: 1,
      userPhone: '13800000014',
      userEmail: 'guowei@fruit-admin.dev',
      status: 1,
      roles: ['user'],
      createTime: '2026-02-23 11:50:00',
    },
    {
      id: 15,
      username: 'maling',
      nickname: '马玲',
      userGender: 2,
      userPhone: '13800000015',
      userEmail: 'maling@fruit-admin.dev',
      status: 1,
      roles: ['admin', 'user'],
      createTime: '2026-03-01 08:15:00',
    },
    {
      id: 16,
      username: 'luoyang',
      nickname: '罗阳',
      userGender: 1,
      userPhone: '13800000016',
      userEmail: 'luoyang@fruit-admin.dev',
      status: 2,
      roles: ['user'],
      createTime: '2026-03-05 13:40:00',
    },
    {
      id: 17,
      username: 'xuting',
      nickname: '徐婷',
      userGender: 2,
      userPhone: '13800000017',
      userEmail: 'xuting@fruit-admin.dev',
      status: 1,
      roles: ['user'],
      createTime: '2026-03-09 10:25:00',
    },
    {
      id: 18,
      username: 'hanyu',
      nickname: '韩宇',
      userGender: 1,
      userPhone: '13800000018',
      userEmail: 'hanyu@fruit-admin.dev',
      status: 1,
      roles: ['user'],
      createTime: '2026-03-14 15:10:00',
    },
  ];
}
