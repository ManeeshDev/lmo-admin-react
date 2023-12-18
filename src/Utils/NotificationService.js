import { BehaviorSubject } from "rxjs";

const subject = new BehaviorSubject(null);

export const notificationService = {
  setRowEditData: (data) => subject.next(data),
  clearRowEditData: () => subject.next(null),
  getRowEditData: () => subject.asObservable(),
};
