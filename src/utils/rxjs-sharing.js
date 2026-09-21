import { Subject } from 'rxjs';

const FileViewerSubject = new Subject();
export const FileViewerService = {
    init: param => FileViewerSubject.next(param),
    status: () => FileViewerSubject.asObservable()
};