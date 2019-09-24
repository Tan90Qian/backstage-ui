import { action, observable, runInAction } from 'mobx';

export class ModalStore {
  @observable visible: boolean;

  constructor(defaultVisible: boolean = false) {
    runInAction(() => {
      this.visible = defaultVisible;
    });
  }
}

export class ModalPresenter {
  @action
  public static setVisible(store: ModalStore, visible: boolean) {
    store.visible = visible;
  }
}
