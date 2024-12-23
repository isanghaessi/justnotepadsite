import {useCallback, useEffect, useMemo, useState} from "react";
import {DateTimeFormatter, LocalDateTime} from "js-joda";
import {v4 as uuidv4} from "uuid";
import {toast, ToastContainer} from "react-toastify";
import RightArrowSvg from '../assets/right-arrow.svg?react';


const MEMO_STORAGE_KEY = 'JUST_MEMO_PAD_SITE_MEMOS';
const INITIAL_MEMO = {
    isOnDelete: false,
    value: '',
}
const DATE_TIME_PATTERN = 'yyyy-MM-dd HH:mm:ss';

const getNewMemoStorageKey = () => `${MEMO_STORAGE_KEY}-${uuidv4()}`;
const getDefaultTitle = () => `Memo ${LocalDateTime.now().format(DateTimeFormatter.ofPattern(DATE_TIME_PATTERN))}`;
const getDefaultMemos = () => [{...INITIAL_MEMO}];

function UseMemoStorage() {
    const [memoStorageKey, setMemoStorageKey] = useState(getNewMemoStorageKey());
    const [title, setTitle] = useState(getDefaultTitle());
    const [memos, setMemos] = useState(getDefaultMemos());
    const [lastSyncedDateTime, setLastSyncedDateTime] = useState('');
    const [savedDatas, setSavedDatas] = useState([]);

    const data = useMemo(() => ({
        memoStorageKey,
        title,
        memos,
        lastSyncedDateTime
    }), [memoStorageKey, title, memos, lastSyncedDateTime]);

    useEffect(() => {
        getAllDatas();
    }, []);

    useEffect(() => {
        saveData();
    }, [data]);

    const getAllDatas = () => setSavedDatas(Object.entries({...localStorage}).filter(([_key, _]) => _key && _key.startsWith(MEMO_STORAGE_KEY))
        .map(([_key, _value]) => [_key, JSON.parse(_value)]));

    const loadData = (key) => {
        try {
            const {memoStorageKey: _memoStorageKey, title: _title, memos: _memos, lastSyncedDateTime: _lastSyncedDateTime} = JSON.parse(localStorage.getItem(key));

            if (!_memoStorageKey || !_title || !_memos || !_lastSyncedDateTime) {
                throw new Error('');
            }

            setMemoStorageKey(_memoStorageKey);
            setTitle(_title);
            setMemos(_memos);
            setLastSyncedDateTime(_lastSyncedDateTime);
        } catch (e) {
            toast.error('Load memos fail!');
        }
    }

    const saveData = useCallback(() => {
        try {
            localStorage.setItem(memoStorageKey, JSON.stringify({
                ...data,
                lastSyncedDateTime: LocalDateTime.now().format(DateTimeFormatter.ofPattern(DATE_TIME_PATTERN))
            }));
        } catch (e) {
            toast.error(`Save memos fail!`);
        }

        getAllDatas();
    }, [memoStorageKey, title, memos]);

    const clearData = () => {
        savedDatas.forEach(([_key, _]) => localStorage.removeItem(_key));

        setMemoStorageKey(getNewMemoStorageKey());
        setTitle(getDefaultTitle());
        setMemos(getDefaultMemos());

        getAllDatas();
    }

    const getDashboard = () => (
        <div className={'w-100'}>
            <div className={'d-flex w-100 align-items-center justify-content-between p-2'}>
                <div className={'w-75'}>
                    <div className={'d-flex w-100 align-items-center justify-content-between'}>
                        <div className={'fs-3'}>Your saved notes here</div>
                        <div className={'link-secondary'}>Your notes will be saved automatically. But, you can save it manually&nbsp;<RightArrowSvg width={'1rem'} height={'1rem'}/></div>
                    </div>
                    <div className={'link-danger'}>Note: Your notes will be saved in your browser. It will not be deleted when you close the browser.</div>
                    <div className={'link-danger'}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;But, it can be deleted somehow. So, please keep your notes in a safe place.</div>
                </div>
                <div className={'d-flex'}>
                    <button type="button" className="btn btn-outline-dark m-1" onClick={saveData}>Save</button>
                    <button type="button" className="btn btn-outline-danger m-1" onClick={clearData}>Clear All</button>
                </div>
            </div>
            <div className={'d-flex flex-column align-items-baseline overflow-auto'}
                 style={{
                     maxHeight: '300px',
                 }}>
                {savedDatas.length === 0
                    ? <div>... No saved notes</div>
                    : savedDatas.map(([_key, _data]) =>
                        <button type="button" className="btn btn-link  m-1" key={_key} onClick={() => loadData(_key)}>{`${_data.title} - [Last Syncd Time] ${_data.lastSyncedDateTime}`}</button>)
                }
            </div>
        </div>
    )

    return {
        toastContainer: <ToastContainer/>,
        dashboard: getDashboard(),
        data,
        setTitle,
        setMemos,
        saveData,
    }
}

export default UseMemoStorage