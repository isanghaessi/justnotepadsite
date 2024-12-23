import {useCallback, useEffect, useMemo} from "react";
import Memo from "./components/Memo.jsx";
import ConfirmModal from "./components/ConfirmModal.jsx";
import RightArrowSvg from './assets/right-arrow.svg?react';
import useMemoStorage from "./hooks/UseMemoStorage.jsx";
import ContentEditable from "react-contenteditable";

const COLUMN_COUNT = 2;
const INITIAL_MEMO = {
    isOnDelete: false,
    value: ''
}

function App() {
    const {
        toastContainer,
        dashboard,
        data,
        setTitle,
        setMemos,
    } = useMemoStorage();

    const memos = useMemo(() => data.memos, [data]);
    const title = useMemo(() => data.title, [data]);
    const memoCount = useMemo(() => memos.length, [memos]);
    const rowCount = useMemo(() => Math.ceil(memoCount / COLUMN_COUNT), [memoCount]);
    const isOnAnyDelete = useMemo(() => memos.filter((memo) => memo.isOnDelete).length > 0, [memos]);

     const onCancelRootListenerCallback = useCallback((event) => {
        if (!isOnAnyDelete) {
            return;
        }

        if (event.key === 'Escape') {
            onDeleteCancel();
        }
    }, [isOnAnyDelete]);

    useEffect(() => {
        const $root = document.getElementById('root');

        $root.addEventListener('keydown', onCancelRootListenerCallback);

        return () => {
            $root.removeEventListener('keydown', onCancelRootListenerCallback);
        };
    }, [isOnAnyDelete]);

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
        setMemos((previousMemos) => previousMemos.map((memo) =>
            ({
                ...memo,
                isOnDelete: false
            })
        ));
    }

    const onTitleChange = (event) => {
        const newTitle = event.target.value;

        if (!newTitle) {
            return;
        }

        setTitle(newTitle.replace(/<br>/g, ''));
    }

    return <div className={'position-relative min-vw-100 min-vh-100 p-5 d-flex flex-column align-items-center'}>
        <nav className={'navbar navbar-light w-100'}>
            <a className={'navbar-brand fs-1'} href={'/'}>JustNotepad.site</a>
        </nav>
        <div className={'d-flex flex-row w-100 align-items-center justify-content-between m-3'}>
            <div>
                <div className={'d-flex'}>
                    <lebel className={'fs-3'}>Title:&nbsp;</lebel>
                    <ContentEditable
                        html={title}
                        onChange={onTitleChange}
                        onkeydown={(event) => event.preventDefault()}
                        tagName={'span'}
                        className={'fs-3'}
                    />
                </div>
                <div style={{
                    fontSize: '0.8rem',
                }}
                     className={'link-secondary'}>You can change title by click!
                </div>
            </div>
            <button type="button" className="btn btn-dark" onClick={() => setMemos((previousMemos) => [...previousMemos, {...INITIAL_MEMO}])}>+ Add Note</button>
        </div>
        <div className={'align-self-end d-flex justify-content-between m-3'}>
        </div>
        {memoCount === 0
            ? <div className={'w-100 d-flex justify-content-center'}>
                <h4>... Add Some Notes!&nbsp;&nbsp;<RightArrowSvg width={'1rem'} height={'1rem'}/></h4>
            </div>
            : <div className={'w-100'}>
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
        <div className={'w-100'}>
            {dashboard}
        </div>
        <ConfirmModal isShow={isOnAnyDelete} onConfirm={onDeleteConfirm} onCancel={onDeleteCancel}/>
        {toastContainer}
    </div>
}

export default App
