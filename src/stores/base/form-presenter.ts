import { action, observable } from 'mobx';

export class FormStore<T = {}> {
  @observable formData: T;

  @observable lastFormData: T;

  defaultFormData: T;

  constructor(defaultFormData?: T) {
    if (defaultFormData && typeof defaultFormData === 'object') {
      this.defaultFormData = defaultFormData;
      this.formData = defaultFormData;
      this.lastFormData = defaultFormData;
    }
  }
}

export class FormPresenter {
  @action
  public static setFormData<T = {}>(store: FormStore, formData: T) {
    store.formData = formData;
  }

  @action
  public static update(store: FormStore) {
    store.lastFormData = store.formData;
  }

  @action
  public static rollback(store: FormStore) {
    store.formData = store.lastFormData;
  }

  @action
  public static reset(store: FormStore) {
    store.formData = store.defaultFormData;
    store.lastFormData = store.defaultFormData;
  }
}
