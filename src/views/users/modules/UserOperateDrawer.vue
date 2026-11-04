<script setup lang="ts">
import type { UserFormModel, UserOperateType, UserRecord, UserSavePayload } from '@/typings/user';

import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import { useDisplay, useLocale } from 'vuetify';

import {
  createUserFormModel,
  USER_GENDERS,
  USER_ROLES,
  USER_STATUSES,
} from '@/views/users/modules/userData';

interface Props {
  /** Add or edit mode. */
  operateType: UserOperateType;
  /** The row being edited; ignored in add mode. */
  user?: UserRecord | null;
}

interface Emits {
  /** The form passed validation; the page persists it. */
  save: [payload: UserSavePayload];
}

const { operateType, user = null } = defineProps<Props>();
const visible = defineModel<boolean>('visible', { default: false });
const emit = defineEmits<Emits>();

const { t } = useLocale();
const { mobile } = useDisplay();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
const PHONE_PATTERN = /^1\d{10}$/;

const drawerWidth = computed(() => (mobile.value ? 'min(90vw, 380px)' : 380));
const title = computed(() =>
  operateType === 'edit' ? t('views.users.editUser') : t('views.users.addUser'),
);

const formModel = ref<UserFormModel>(createUserFormModel());
const formRef = useTemplateRef<{
  resetValidation: () => void;
  validate: () => Promise<{ valid: boolean }>;
}>('form');

const roleOptions = computed(() =>
  USER_ROLES.map((role) => ({ title: t(role.labelKey), value: role.code })),
);

const rules = computed(() => ({
  username: [
    (value: unknown) =>
      typeof value === 'string' && value.trim() !== ''
        ? true
        : t('views.users.validation.username'),
  ],
  userEmail: [
    (value: unknown) => {
      const email = typeof value === 'string' ? value.trim() : '';

      return email === '' || EMAIL_PATTERN.test(email) ? true : t('views.users.validation.email');
    },
  ],
  userPhone: [
    (value: unknown) => {
      const phone = typeof value === 'string' ? value.trim() : '';

      return phone === '' || PHONE_PATTERN.test(phone) ? true : t('views.users.validation.phone');
    },
  ],
}));

/** Copy a table row into the editable form model. */
function toFormModel(record: UserRecord): UserFormModel {
  return {
    username: record.username,
    nickname: record.nickname,
    userGender: record.userGender,
    userPhone: record.userPhone,
    userEmail: record.userEmail,
    userRoleCodes: [...record.roles],
    status: record.status,
  };
}

watch(visible, async (open) => {
  if (!open) {
    return;
  }

  formModel.value =
    operateType === 'edit' && user !== null ? toFormModel(user) : createUserFormModel();

  await nextTick();
  formRef.value?.resetValidation();
});

async function submit() {
  const result = await formRef.value?.validate();

  if (result?.valid !== true) {
    return;
  }

  emit('save', {
    operateType,
    user: { ...formModel.value, userRoleCodes: [...formModel.value.userRoleCodes] },
  });
}
</script>

<template>
  <VNavigationDrawer v-model="visible" location="right" order="-1" temporary :width="drawerWidth">
    <template #prepend>
      <div class="flex items-center justify-between px-4 pb-2 pt-3">
        <h2 class="text-title-medium">{{ title }}</h2>

        <VBtn
          :aria-label="t('views.users.cancel')"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="visible = false"
        />
      </div>
    </template>

    <div class="px-4">
      <VForm ref="form" @submit.prevent="submit">
        <VTextField
          v-model="formModel.username"
          class="mb-3"
          density="comfortable"
          :label="t('views.users.username')"
          :placeholder="t('views.users.form.username')"
          :rules="rules.username"
          variant="outlined"
        />

        <VTextField
          v-model="formModel.nickname"
          class="mb-3"
          density="comfortable"
          :label="t('views.users.nickname')"
          :placeholder="t('views.users.form.nickname')"
          variant="outlined"
        />

        <div class="mb-1 text-body-medium">{{ t('views.users.userGender') }}</div>
        <VRadioGroup v-model="formModel.userGender" class="mb-3" inline>
          <VRadio
            v-for="gender in USER_GENDERS"
            :key="gender.value"
            :label="t(gender.labelKey)"
            :value="gender.value"
          />
        </VRadioGroup>

        <VTextField
          v-model="formModel.userPhone"
          class="mb-3"
          density="comfortable"
          :label="t('views.users.userPhone')"
          :placeholder="t('views.users.form.userPhone')"
          :rules="rules.userPhone"
          variant="outlined"
        />

        <VTextField
          v-model="formModel.userEmail"
          class="mb-3"
          density="comfortable"
          :label="t('views.users.userEmail')"
          :placeholder="t('views.users.form.userEmail')"
          :rules="rules.userEmail"
          variant="outlined"
        />

        <div class="mb-1 text-body-medium">{{ t('views.users.userStatus') }}</div>
        <VRadioGroup v-model="formModel.status" class="mb-3" inline>
          <VRadio
            v-for="status in USER_STATUSES"
            :key="status.value"
            :label="t(status.labelKey)"
            :value="status.value"
          />
        </VRadioGroup>

        <VSelect
          v-model="formModel.userRoleCodes"
          chips
          closable-chips
          density="comfortable"
          item-title="title"
          item-value="value"
          :items="roleOptions"
          :label="t('views.users.userRole')"
          multiple
          :placeholder="t('views.users.form.userRole')"
          variant="outlined"
        />
      </VForm>
    </div>

    <template #append>
      <VDivider />
      <div class="flex justify-end gap-2 p-4">
        <VBtn variant="text" @click="visible = false">{{ t('views.users.cancel') }}</VBtn>
        <VBtn color="primary" variant="flat" @click="submit">{{ t('views.users.save') }}</VBtn>
      </div>
    </template>
  </VNavigationDrawer>
</template>
