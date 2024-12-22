import {useEffect, useState} from "react";
import TrashSvg from '../assets/trash.svg?react';
import classNames from "classnames";

function Memo({index, value, onChange, isOnDelete, onDelete}) {
    const [memo, setMemo] = useState(value ?? '');

    useEffect(() => {
        onChange(index, memo);
    }, [memo]);

    return <div className={'p-1'}>
        <textarea className={classNames('w-100', {'border-danger border-3': isOnDelete})} style={{height: '200px'}} value={memo} onChange={(event) => setMemo(event.target.value)}/>
        <button type="button" className="btn float-end m-0 p-0">
            <TrashSvg width={'20px'} height={'20px'} onClick={() => onDelete(index)}/>
        </button>
    </div>
}

export default Memo