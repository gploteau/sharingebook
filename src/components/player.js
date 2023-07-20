import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useCookies} from 'react-cookie';
import {usePathname, useSearchParams, useRouter} from 'next/navigation'
import Image from 'next/image';

import TracksList from "@/components/tracksList";
import './player.scss'

import ShareIcon from 'public/assets/icons/share.svg';

import HeartIcon from 'public/assets/icons/heart-icon.svg';
import FullHeartIcon from 'public/assets/icons/heart-icon-filled-04.svg';

import HandleIcon from 'public/assets/icons/handle-13.svg';
import HandleDownIcon from 'public/assets/icons/handle-14.svg';

import NextTrackIcon from 'public/assets/icons/control-icon-12.svg';
import PrevTrackIcon from 'public/assets/icons/control-icon-11.svg';
import PlayTrackIcon from 'public/assets/icons/control-icon-10.svg';
import PauseTrackIcon from 'public/assets/icons/control-icon-09.svg';

import SpeakerIcon from 'public/assets/icons/volume-icon-15.svg';
import SpeakerMuteIcon from 'public/assets/icons/volume-icon-muted-15.svg';

import TrackListIcon from 'public/assets/icons/bottom-icons-20.svg';
import LoopIcon from 'public/assets/icons/bottom-icons-21.svg';
import ShuffleIcon from 'public/assets/icons/bottom-icons-22.svg';

// eslint-disable-next-line
Number.prototype.toHHMMSS = function () {
    // snippet taken from stackoverflow
    let sec_num = parseInt(this, 10); // don't forget the second param
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return (hours > 0 ? hours + ':' : "") + minutes + ':' + seconds;
}

export default function Player(props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [cookies, setCookie, removeCookie] = useCookies(['favorites', 'currentSong', 'currentTime']);

    const [isFirstTrack, setFirstTrack] = useState(true)
    const [isLoading, setLoading] = useState(true)
    const [isTrackLoading, setTrackLoading] = useState(true)
    const [audio, setAudio] = useState(null)
    const [volume, setVolume] = useState(0.5)
    const [progress, setProgress] = useState(0)
    const [newProgress, setNewProgress] = useState(0)
    const [trackListOpened, setTrackListOpened] = useState(false)
    const [index, setIndex] = useState(0);
    const [pause, setPause] = useState(true);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [duration, setDuration] = useState('00:00');
    const [currentSong, setCurrentSong] = useState({name: '', author: '', cover: '', file: '', duration: ''})
    const [musicList, setMusicList] = useState([]);

    const refHandleVolume = useRef(null);
    const refVolumeBarCtrl = useRef(null);
    const [volumeHandleLeft, setVolumeHandleLeft] = useState(0);
    const [volumeBarSize, setVolumeBarSize] = useState(0);
    const [handleVolumeDown, setHandleVolumeDown] = useState(false);

    const refProgressBar = useRef(null);
    const [progressHandleLeft, setProgressHandleLeft] = useState(0);
    const [progressBarSize, setProgressBarSize] = useState(0);
    const [handleProgressDown, setHandleProgressDown] = useState(false);
    const [spannedTime, setSpannedTime] = useState('');

    const [audioLoop, setAudioLoop] = useState(false);
    const [audioShuffle, setAudioShuffle] = useState(false);

    const [favoriteList, setFavoriteList] = useState([]);

    const resizeComponents = () => {
        const {width: volumeBarWidth} = refVolumeBarCtrl.current.getBoundingClientRect();
        setVolumeHandleLeft(volumeBarWidth * volume);
        setVolumeBarSize(volumeBarWidth - volumeBarWidth * volume)

        const {width: progressBarWidth} = refProgressBar.current.getBoundingClientRect();
        if (!handleProgressDown) {
            setProgressHandleLeft(progressBarWidth * progress / 100);
            setProgressBarSize(progressBarWidth - progressBarWidth * progress / 100)
        }
    }

    useLayoutEffect(() => {
        resizeComponents();
    }, []);

    const getTracks = async () => {
        const res = await fetch('/api/files')
        return res.json()
    }

    useEffect(() => {

        if (musicList.length === 0) {
            getTracks()
                .then((data) => {
                    setMusicList(data)
                    if (typeof cookies['favorites'] !== 'undefined' && cookies['favorites'].length) {
                        setFavoriteList(cookies['favorites'])
                    }
                    let startTrack = data[0];
                    let startIndex = -1;
                    if(props.track_id) {
                        let index = data.findIndex((item) => item.id === props.track_id);
                        if (index !== -1) {
                            startTrack = data[index];
                            startIndex = index;
                        }
                    }
                    if (startIndex === -1 && typeof cookies['currentSong'] !== 'undefined' && cookies['currentSong']) {
                        let index = data.findIndex((item) => item.id === cookies['currentSong']);
                        startTrack = data[index];
                        startIndex = index;
                    }
                    setCurrentSong(startTrack);
                    setIndex(startIndex === -1 ? 0 : startIndex);
                })
        }

        if (audio !== null) {
            audio.volume = volume;

            if (newProgress !== 0 && !handleProgressDown) {
                try {
                    audio.currentTime = audio.duration * newProgress / 100;
                    setNewProgress(0);
                    setProgress(newProgress);
                } catch (e) {
                    console.log(e);
                }
            }
        }


        if (pause && !isLoading && audio !== null) {
            audio.pause();
        } else {

            if (audio === null && musicList.length > 0) {
                setPause(true);
                let newAudio = new Audio(musicList[index].file)

                setProgress(0);
                setCurrentTime('00:00');
                setCurrentTime('00:00');

/*                if (typeof cookies['currentSong'] !== 'undefined' && cookies['currentSong'] === musicList[index].id &&
                    typeof cookies['currentTime'] !== 'undefined' && cookies['currentTime']) {
                    newAudio.currentTime = cookies['currentTime'];
                } else {
                    newAudio.currentTime = 0;
                }*/
                newAudio.currentTime = 0;

                newAudio.volume = volume;
                newAudio.preload = 'metadata';
                newAudio.autoplay = false;
                newAudio.loop = audioLoop;

                if (!isLoading) newAudio.play();

                setLoading(false);

                setCookie('currentSong', musicList[index].id, {
                    path: '/',
                });

                router.push('/' + musicList[index].id);

                newAudio.addEventListener('loadedmetadata', (e) => {
                    setProgress(e.target.currentTime / e.target.duration * 100);
                    setDuration(e.target.duration.toHHMMSS());
                    setCurrentTime(e.target.currentTime.toHHMMSS());
                    setTrackLoading(false);
                    if (isFirstTrack) {
                        setFirstTrack(false);
                    } else {
                        setPause(false);
                    }
                });

                newAudio.addEventListener('play', (e) => {
                    setPause(false);
                });

                newAudio.addEventListener('pause', (e) => {
                    setPause(true);
                });

                newAudio.addEventListener('ended', () => {
                    if (!audioLoop) {
                        if (audioShuffle) {
                            clickAudio(Math.floor(Math.random() * musicList.length));
                        } else {
                            nextSong();
                        }
                    }
                });

                newAudio.addEventListener('timeupdate', () => {
                    if (!newProgress && !handleProgressDown) setProgress(newAudio.currentTime / newAudio.duration * 100);
                    setCurrentTime(newAudio.currentTime.toHHMMSS());
                    setDuration(newAudio.duration.toHHMMSS());

                    setCookie('currentTime', newAudio.currentTime, {
                        path: '/',
                    });
                });

                setAudio(newAudio);
                setCurrentSong(musicList[index]);

            } else if (audio !== null) {
                audio.loop = audioLoop;
                audio.play();
            }
        }

        function updateSize() {
            resizeComponents();
        }

        resizeComponents();

        window.addEventListener('resize', updateSize);

        setCookie('favorites', favoriteList, {
            path: '/',
        });

    }, [index, pause, volume, progress, audioLoop, favoriteList, currentSong, handleProgressDown]);

    const playOrPause = () => {
        if (isTrackLoading) return;
        setPause(!pause);
    }

    const prevSong = () => {
        if (index === 0) {
            clickAudio(musicList.length - 1);
        } else {
            clickAudio(index - 1);
        }
    }

    const nextSong = () => {
        if (index === musicList.length - 1) {
            clickAudio(0);
        } else {
            clickAudio(index + 1);
        }
    }

    function clickAudio(key) {
        if (key === index) {
            playOrPause();
            return;
        }
        setTrackLoading(true);
        setLoading(true);
        if (audio !== null) audio.pause();
        setAudio(null);
        setIndex(key);
        setPause(false);
        setTimeout(() => {
            setTrackListOpened(false)
        }, 500);
    }

    const calculateProgress = (touchPosition) => {
        const {width} = refProgressBar.current.getBoundingClientRect();
        const newPosition = touchPosition - ((window.innerWidth - width) / 2)

        if (newPosition < 0) return;
        if (newPosition > width) return;

        const {width: progressBarWidth} = refProgressBar.current.getBoundingClientRect();

        if (audio !== null) {
            let spannedTime = audio.duration / progressBarWidth * newPosition;
            if (isNaN(spannedTime)) spannedTime = 0;
            setSpannedTime(spannedTime.toHHMMSS());
        }

        let newProgress = parseFloat(1.0 / width) * parseFloat(newPosition);
        setProgress(newProgress * 100);
        setNewProgress(newProgress * 100);
        setProgressHandleLeft(width * newProgress);
    }

    const progressBarPickHandler = (e) => {
        if (isTrackLoading) return;

        let touchPosition = 0;
        if (e.type === 'mousedown') {
            touchPosition = e.pageX;
            document.addEventListener('mousemove', progressBarMoveHandler);
            document.addEventListener('mouseup', progressBarDropHandler);
            setHandleProgressDown(true);
        } else if (e.type === 'touchstart') {
            touchPosition = e.touches[0].pageX;
            e.target.addEventListener('touchmove', progressBarMoveHandler);
            e.target.addEventListener('touchend', progressBarDropHandler);
            setHandleProgressDown(true);
        }

        calculateProgress(touchPosition);
    }


    const progressBarMoveHandler = (e) => {
        if (isTrackLoading) return;

        let touchPosition = 0;
        if (e.type === 'mousemove') {
            touchPosition = e.pageX;
            document.addEventListener('mouseup', progressBarDropHandler);
        } else if (e.type === 'touchmove') {
            touchPosition = e.touches[0].pageX;
            e.target.addEventListener('touchend', progressBarDropHandler);
        }

        calculateProgress(touchPosition);
    }

    const progressBarDropHandler = (e) => {
        if (isTrackLoading) return;

        setHandleProgressDown(false);
        setSpannedTime('')
        e.target.removeEventListener('touchmove', progressBarMoveHandler);
        e.target.removeEventListener('touchend', progressBarDropHandler);
        document.removeEventListener('mousemove', progressBarMoveHandler);
        document.removeEventListener('mouseup', progressBarDropHandler);
    }

    const calculateVolume = (touchPosition) => {
        const {width} = refVolumeBarCtrl.current.getBoundingClientRect();
        const newPosition = touchPosition - ((window.innerWidth - width) / 2)
        if (newPosition < 0) return;
        if (newPosition > width) return;

        setVolumeHandleLeft(newPosition)
        setVolumeBarSize(width - newPosition)
        let newVolume = (parseFloat(1.0 / width) * parseFloat(newPosition)).toFixed(2)
        setVolume(newVolume);
    }

    const volumeBarPickHandler = (e) => {
        let touchPosition = 0;
        if (e.type === 'mousedown') {
            touchPosition = e.pageX;
            document.addEventListener('mousemove', volumeBarMoveHandler);
            document.addEventListener('mouseup', volumeBarDropHandler);
            setHandleVolumeDown(true);
        } else if (e.type === 'touchstart') {
            touchPosition = e.touches[0].pageX;
            e.target.addEventListener('touchmove', volumeBarMoveHandler);
            e.target.addEventListener('touchend', volumeBarDropHandler);
            setHandleVolumeDown(true);
        }

        calculateVolume(touchPosition);
    }

    const volumeBarMoveHandler = (e) => {
        let touchPosition = 0;
        if (e.type === 'mousemove') {
            touchPosition = e.pageX;
            document.addEventListener('mouseup', volumeBarDropHandler);
        } else if (e.type === 'touchmove') {
            touchPosition = e.touches[0].pageX;
            e.target.addEventListener('touchend', volumeBarDropHandler);
        }

        calculateVolume(touchPosition);
    }

    const volumeBarDropHandler = (e) => {
        setHandleVolumeDown(false);
        e.target.removeEventListener('touchmove', volumeBarMoveHandler);
        e.target.removeEventListener('touchend', volumeBarDropHandler);
        document.removeEventListener('mousemove', volumeBarMoveHandler);
        document.removeEventListener('mouseup', volumeBarDropHandler);
    }

    const mutePlayer = () => {
        setVolume(0);
    }

    const addToFavorite = () => {
        if (favoriteList.includes(currentSong.id)) {
            setFavoriteList(favoriteList.filter(item => item !== currentSong.id));
        } else {
            setFavoriteList([...favoriteList, currentSong.id]);
        }
    }

    const shareTrack = () => {
        console.log(window.location.origin + pathname);
        navigator.share({
            title: currentSong.title,
            text: currentSong.title,
            url: window.location.origin + pathname,
        })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
    }

    return (
        <div className="player">
            {typeof currentSong !== 'undefined' ? <link rel="preload" as="fetch" href={currentSong.file}/> : null}
            <TracksList opened={trackListOpened}
                        close={() => setTrackListOpened(!trackListOpened)}
                        tracks={musicList}
                        favs={favoriteList}
                        current={index}
                        setCurrent={clickAudio}
            />
            <div className="ctr-1"><p className="play-pause-text">
                <strong>{pause ? 'PAUSED' : 'PLAYING'}</strong><span>{currentTime} / {duration}</span></p>
                <div className="top-icons">
                    <button className="heart-icon" onClick={addToFavorite}>
                        {typeof currentSong !== 'undefined' && favoriteList.includes(currentSong.id) ?
                            <FullHeartIcon/> : <HeartIcon/>}
                    </button>
                    <button className="share-icon" onClick={shareTrack}>
                        <ShareIcon/>
                    </button>
                </div>
            </div>
            <p className="track-title"
               title={currentSong.title || 'No title'}>{isLoading ? 'Loading...' : currentSong.title || 'No title'}</p>
            {currentSong.author ?
                <p className="track-author" title={currentSong.author}>{currentSong.author}</p> : null}
            <div className="cover-container">
                {isLoading ? <div style={{height: 213}}/> :
                    <Image src={currentSong.cover} height={200} width={200} alt={""}/>}
                {isTrackLoading ? <div className="track-loader"></div> : null}
            </div>
            <div className="bottom-ctr">
                <div className="progress-container"
                     onTouchStart={progressBarPickHandler}
                     onMouseDown={progressBarPickHandler}
                >
                    <div className="progress-bar" ref={refProgressBar}>
                        <div className="done" id="doneProgressBar" style={{right: progressBarSize}}></div>
                        <div className="remaining"></div>
                    </div>
                    <div className="handle-ctr" style={{left: progressHandleLeft}}>
                        <p className="time-span">
                            {spannedTime ? spannedTime : currentTime}
                            <span></span>
                        </p>
                        <button className="handle">
                            {handleProgressDown ? <HandleDownIcon/> : <HandleIcon/>}
                        </button>
                    </div>
                </div>
                <div className="control-icons-container">
                    <button className="play-control prev-track-btn-ctr" onClick={prevSong}>
                        <PrevTrackIcon/>
                    </button>
                    <button className="play-control play-pause-container" onClick={playOrPause}>
                        {pause ? <PlayTrackIcon/> : <PauseTrackIcon/>}
                    </button>
                    <button className="play-control next-track-btn-ctr" onClick={nextSong}>
                        <NextTrackIcon/>
                    </button>
                </div>
                <div className="volume-container"
                     onTouchStart={volumeBarPickHandler}
                     onMouseDown={volumeBarPickHandler}
                >
                    <div className="volume-icon-ctr">
                        <button className="speaker-icon" onClick={mutePlayer}>
                            {volume < 0.01 ? <SpeakerMuteIcon/> : <SpeakerIcon/>}
                        </button>
                    </div>
                    <div className="volume-bar-ctr" ref={refVolumeBarCtrl}>
                        <div className="volume-bar">
                            <div className="done" style={{right: volumeBarSize}}></div>
                            <div className="remaining"></div>
                        </div>
                        <div className="handle-ctr" ref={refHandleVolume} style={{left: volumeHandleLeft}}>
                            <button className="handle"
                                    style={{backgroundColor: handleVolumeDown ? '#333' : '#f0f8ff'}}></button>
                        </div>
                    </div>
                    <div className="volume-pctg-ctr">
                        <span>{parseInt(volume * 100, 10)}</span>
                    </div>
                </div>
                <div className="bottom-icons-ctr">
                    <button className="tracks-list-btn" onClick={() => setTrackListOpened(!trackListOpened)}>
                        <TrackListIcon/>
                    </button>
                    <button className="loop-btn" onClick={() => setAudioLoop(!audioLoop)}>
                        <LoopIcon style={{opacity: audioLoop ? 1 : 0.6}}/>
                    </button>
                    <button className="shuffle-btn" onClick={() => setAudioShuffle(!audioShuffle)}>
                        <ShuffleIcon style={{opacity: audioShuffle ? 1 : 0.6}}/>
                    </button>
                </div>
            </div>
        </div>
    );

}
