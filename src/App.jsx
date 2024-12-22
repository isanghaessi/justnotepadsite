import {useMemo, useState} from "react";
import Memo from "./components/Memo.jsx";
import ConfirmModal from "./components/ConfirmModal.jsx";

const COLUMN_COUNT = 2;
const INITIAL_MEMO = {
    isOnDelete: false,
    value: ''
}

function App() {
    const [memos, setMemos] = useState([{...INITIAL_MEMO}]);

    const memoCount = useMemo(() => memos.length, [memos]);
    const rowCount = useMemo(() => Math.ceil(memoCount / COLUMN_COUNT), [memoCount]);
    const isOnAnyDelete = useMemo(() => memos.filter((memo) => memo.isOnDelete).length > 0, [memos]);

    const onMemoValueChange = (index, value) => {
        memos[index].value = value;
        setMemos([...memos]);
    }

    const onDelete = (index) => {
        memos[index].isOnDelete = true;
        setMemos([...memos]);
    }

    const onDeleteConfirm = () => {
        setMemos((previousMemos) => previousMemos.filter((memo) => !memo.isOnDelete));
    }

    const onDeleteCancel = () => {
        memos.forEach((memo) => memo.isOnDelete = false);
        setMemos([...memos]);
    }

    return <div className={'position-relative min-vw-100 min-vh-100 p-5 d-flex flex-column align-items-center'}>
        <nav className={'navbar navbar-light w-100'}>
            <a className={'navbar-brand fs-2'} href={'/'}>Just Notepad</a>
        </nav>
        <div className={'align-self-end d-flex justify-content-between'}>
            <button type="button" className="btn btn-dark" onClick={() => setMemos((previousMemos) => [...previousMemos, {...INITIAL_MEMO}])}>+ Add Note</button>
        </div>
        {memoCount === 0
            ? <>
                <div className={'w-100 d-flex justify-content-center'}>
                    <h4>... Add Some Notes!</h4>
                </div>
            </>
            : <div className={'contatiner w-100'}>
                {Array.from({length: rowCount}, (_, i) => i).map((i) => (
                    <div className={'row'} key={i}>
                        <div className={'col'}>
                            <Memo index={i * 2} value={memos[i * 2].value} onChange={onMemoValueChange} isOnDelete={memos[i * 2].isOnDelete} onDelete={onDelete}/>
                        </div>
                        {memos.length > i * 2 + 1 && <div className={'col'}>
                            <Memo index={i * 2 + 1} value={memos[i * 2 + 1].value} onChange={onMemoValueChange} isOnDelete={memos[i * 2 + 1].isOnDelete} onDelete={onDelete}/>
                        </div>}
                    </div>)
                )}
            </div>}
        <ConfirmModal isShow={isOnAnyDelete} onConfirm={onDeleteConfirm} onCancel={onDeleteCancel}/>
    </div>
}

export default App
