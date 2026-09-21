
import { FileViewerService } from '../utils/rxjs-sharing';
import { GET_ARRAY_BUFFER_FORM_URL } from '../../src/constant';
import Axios from 'axios';

const AppHelpers = {
    showRx: function (rx) {
        if (typeof rx.pdf == 'undefined') { return; }

        let toPrint = (typeof rx.print != 'undefined' && rx.print) ? true : false;
        Axios.post(GET_ARRAY_BUFFER_FORM_URL, { f: rx.pdf }, {
                responseType: 'arraybuffer',
                headers: {
                    Accept: 'application/json',
                    "x-api-token": "token-here",
                    "x-device-id": 'device - id - 1234',
                    "x-device-type": 'android12',
                    "x-device-version": 'v1'
                }
            },
        ).then((response) => {
            const blob = new Blob([response.data], { type: rx.mime_type });
            const url = URL.createObjectURL(blob);
            this.launchCompRxViewer(url, toPrint);
        }).catch((error) => {
            console.log(error);
            // this.launchCompRxViewer(rx.pdf, false);
        })
        return;
    },

    launchCompRxViewer: function (pdfUrl, toPrint) {
        FileViewerService.init({
            modalTitle: 'View Documents',
            showFileModal: true,
            files: [{ type: 'pdf', path: pdfUrl }],
            print: toPrint
        });
    }

};

export default AppHelpers;