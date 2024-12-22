import classNames from "classnames";
import {useEffect} from "react";

const CANCEL_BUTTON_ID = "CONFIRM_CANCEL_BUTTON";

function ConfirmModal({isShow, onConfirm, onCancel}) {
    useEffect(() => {
        if (!isShow) {
            return;
        }

        document.getElementById(CANCEL_BUTTON_ID).focus();
    }, [isShow]);

    return <div className={classNames({'modal': !isShow})}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">This note wille be deleted!</h5>
                </div>
                <div className="modal-footer">
                    <button type="button" id={CANCEL_BUTTON_ID} className="btn btn-secondary" onClick={onCancel}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    </div>
}

export default ConfirmModal