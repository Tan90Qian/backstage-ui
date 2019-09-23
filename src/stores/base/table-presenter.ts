import { action, observable } from 'mobx';

export class TableStore<T = {}> {
  @observable current: number;

  @observable pageSize: number;

  defaultPageSize: number;

  @observable total: number;

  @observable dataSource: T[];

  @observable loading: boolean;

  constructor(defaultPageSize = 10) {
    this.pageSize = defaultPageSize;
    this.current = 1;
    this.total = 0;
    this.dataSource = [];
    this.loading = false;
  }
}

export class TablePresenter {
  @action
  public static setDataSource<T = any>(store: TableStore, dataSource: T[]) {
    store.dataSource = dataSource;
  }

  @action
  public static setCurrent(store: TableStore, current: number) {
    store.current = current;
  }

  @action
  public static resetCurrent(store: TableStore) {
    store.current = 1;
  }

  @action
  public static setPageSize(store: TableStore, pageSize: number) {
    store.pageSize = pageSize;
  }

  @action
  public static setTotal(store: TableStore, total: number) {
    store.total = total;
  }

  @action static setLoading(store: TableStore, loading: boolean) {
    store.loading = loading;
  }
}
