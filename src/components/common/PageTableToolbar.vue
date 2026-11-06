<script setup lang="ts">
import type { TableColumnCheck } from '@/composables/useTable';

import { computed } from 'vue';
import { useLocale } from 'vuetify';

interface Props {
  /** Label of the add button; defaults to a generic "add". */
  addLabel?: string;
  /** Label of the batch-delete button; defaults to a generic "batch delete". */
  deleteLabel?: string;
  /** Tooltip / aria label of the column menu. */
  columnsLabel?: string;
  /** Tooltip of the refresh button. */
  refreshLabel?: string;
  showAdd?: boolean;
  showDelete?: boolean;
  showColumns?: boolean;
  showRefresh?: boolean;
  /** Disable batch delete (e.g. when nothing is selected). */
  deleteDisabled?: boolean;
  /** Loading state of the refresh button. */
  loading?: boolean;
  /** Column checks rendered by the column menu (from `useTable`). */
  columnChecks?: readonly TableColumnCheck[];
}

interface Emits {
  add: [];
  delete: [];
  refresh: [];
  'toggle-column': [key: string, checked: boolean];
}

const {
  addLabel,
  deleteLabel,
  columnsLabel,
  refreshLabel,
  showAdd = true,
  showDelete = true,
  showColumns = true,
  showRefresh = true,
  deleteDisabled = false,
  loading = false,
  columnChecks = [],
} = defineProps<Props>();

const emit = defineEmits<Emits>();

const { t } = useLocale();

const addText = computed(() => addLabel ?? t('layout.tableActions.add'));
const deleteText = computed(() => deleteLabel ?? t('layout.tableActions.batchDelete'));
const columnsText = computed(() => columnsLabel ?? t('layout.tableActions.columns'));
const refreshText = computed(() => refreshLabel ?? t('layout.tableActions.refresh'));

function onColumnToggle(key: string, value: unknown) {
  if (typeof value === 'boolean') {
    emit('toggle-column', key, value);
  }
}
</script>

<template>
  <div class="flex items-center gap-1">
    <!-- Extra controls before / after the standard actions. -->
    <slot name="prepend" />

    <slot name="add">
      <VBtn
        v-if="showAdd"
        color="success"
        prepend-icon="mdi-plus"
        variant="outlined"
        @click="emit('add')"
      >
        {{ addText }}
      </VBtn>
    </slot>

    <slot name="delete">
      <VBtn
        v-if="showDelete"
        color="error"
        :disabled="deleteDisabled"
        prepend-icon="mdi-delete-outline"
        variant="outlined"
        @click="emit('delete')"
      >
        {{ deleteText }}
      </VBtn>
    </slot>

    <slot name="refresh">
      <VBtn
        v-if="showRefresh"
        border
        :loading="loading"
        prepend-icon="mdi-refresh"
        :text="refreshText"
        variant="text"
        @click="emit('refresh')"
      />
    </slot>

    <slot name="append" />

    <slot name="columns">
      <VMenu
        v-if="showColumns && columnChecks.length > 0"
        :close-on-content-click="false"
        location="bottom end"
      >
        <template #activator="{ props: menuProps }">
          <VBtn
            v-bind="menuProps"
            :aria-label="columnsText"
            border
            prepend-icon="mdi-view-column-outline"
            text="列设置"
            variant="text"
          />
        </template>

        <VList density="compact" nav>
          <VListItem v-for="check in columnChecks" :key="check.key" class="mt-0" min-height="32">
            <template #prepend>
              <VListItemAction start>
                <VCheckboxBtn
                  density="compact"
                  hide-details
                  inline
                  :model-value="check.checked"
                  @update:model-value="onColumnToggle(check.key, $event)"
                />
              </VListItemAction>
            </template>
            <VListItemTitle>{{ check.title }}</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </slot>
  </div>
</template>
