<script setup lang="ts">
import type { UserSearchParams } from '@/typings/user';

import { ref } from 'vue';
import { useLocale } from 'vuetify';

import {
  createUserSearchParams,
  USER_GENDERS,
  USER_STATUSES,
} from '@/views/users/modules/userData';

interface Emits {
  /** Apply the current filters to the table. */
  search: [];
  /** Clear the filters and the applied table filters. */
  reset: [];
}

const emit = defineEmits<Emits>();

const model = defineModel<UserSearchParams>('model', { required: true });

const { t } = useLocale();

/** Accordion state: the search panel starts expanded. */
const openPanels = ref<string[]>(['search']);

const genderOptions = USER_GENDERS.map((gender) => ({
  title: t(gender.labelKey),
  value: gender.value,
}));

const statusOptions = USER_STATUSES.map((status) => ({
  title: t(status.labelKey),
  value: status.value,
}));

function reset() {
  Object.assign(model.value, createUserSearchParams());
  emit('reset');
}
</script>

<template>
  <VSheet elevation="1">
    <VExpansionPanels v-model="openPanels" elevation="0" :hover="false" static>
      <VExpansionPanel :ripple="false" value="search">
        <VExpansionPanelTitle>{{ t('views.users.search') }}</VExpansionPanelTitle>

        <VExpansionPanelText>
          <VForm @submit.prevent="emit('search')">
            <VRow density="compact">
              <VCol cols="12" md="6" sm="6">
                <VTextField
                  v-model="model.username"
                  density="compact"
                  hide-details
                  :label="t('views.users.username')"
                  :placeholder="t('views.users.form.username')"
                  variant="outlined"
                />
              </VCol>

              <VCol cols="12" md="6" sm="6">
                <VTextField
                  v-model="model.nickname"
                  density="compact"
                  hide-details
                  :label="t('views.users.nickname')"
                  :placeholder="t('views.users.form.nickname')"
                  variant="outlined"
                />
              </VCol>

              <VCol cols="12" md="3" sm="6">
                <VSelect
                  v-model="model.userGender"
                  clearable
                  density="compact"
                  hide-details
                  item-title="title"
                  item-value="value"
                  :items="genderOptions"
                  :label="t('views.users.userGender')"
                  variant="outlined"
                />
              </VCol>

              <VCol cols="12" md="3" sm="6">
                <VSelect
                  v-model="model.status"
                  clearable
                  density="compact"
                  hide-details
                  item-title="title"
                  item-value="value"
                  :items="statusOptions"
                  :label="t('views.users.userStatus')"
                  variant="outlined"
                />
              </VCol>

              <VCol cols="12" md="3" sm="6">
                <VTextField
                  v-model="model.userPhone"
                  density="compact"
                  hide-details
                  :label="t('views.users.userPhone')"
                  :placeholder="t('views.users.form.userPhone')"
                  variant="outlined"
                />
              </VCol>

              <VCol cols="12" md="3" sm="6">
                <VTextField
                  v-model="model.userEmail"
                  density="compact"
                  hide-details
                  :label="t('views.users.userEmail')"
                  :placeholder="t('views.users.form.userEmail')"
                  variant="outlined"
                />
              </VCol>
            </VRow>

            <div class="mt-3 flex justify-end gap-2">
              <VBtn prepend-icon="mdi-refresh" variant="outlined" @click="reset">
                {{ t('views.users.reset') }}
              </VBtn>
              <VBtn color="primary" prepend-icon="mdi-magnify" type="submit" variant="flat">
                {{ t('views.users.search') }}
              </VBtn>
            </div>
          </VForm>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </VSheet>
</template>
