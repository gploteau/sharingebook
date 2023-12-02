import React, {useEffect, useRef, useState} from 'react';
import './trackList.scss'

import BackIcon from 'public/assets/icons/back-btn-23.svg';

import HeartIcon from 'public/assets/icons/heart-icon.svg';
import FullHeartIcon from 'public/assets/icons/heart-icon-filled-04.svg';

export default function TracksList(props) {

    const [onlyFavorite, setOnlyFavorite] = useState(false);

    const searchByTitle = (e) => {
        const value = e.target.value.toLowerCase();
        const list = document.getElementById('tracksListCtr');
        const items = list.getElementsByTagName('li');
        for (let i = 0; i < items.length; ++i) {
            if (items[i].innerText.toLowerCase().indexOf(value) > -1) {
                items[i].style.display = 'block';
            } else {
                items[i].style.display = 'none';
            }
        }
    }

    return (
        <div className={"tracks-list" + (props.opened ? ' opened' : '')}>
            <div className="tracks-list-ctr" id="tracksListCtr">
                <ul>
                    {props.tracks.map((track, index) => {
                            if (onlyFavorite && !props.favs.includes(track.id)) {
                                return null;
                            }
                            return (
                                <li onClick={() => props.setCurrent(index)}
                                    className={index === props.current ? 'active' : ''} key={index}>
                                    <span>{index === props.current ? <strong>&gt; </strong> : null}{track.title}</span></li>
                            )
                        }
                    )}
                </ul>
            </div>
            <div className="bottom-ctr">
                <div className="search-ctr">
                    <input className="search-bar" placeholder="Search" onKeyUp={searchByTitle}/>
                </div>
                <div className="bottom-btns-ctr">
                    <button className="back-btn" onClick={props.close}>
                        <BackIcon/>
                    </button>
                    <button className="favs-btn" onClick={() => setOnlyFavorite(!onlyFavorite)}>
                        {onlyFavorite ? <FullHeartIcon/> : <HeartIcon/>}
                    </button>
                </div>
            </div>
        </div>
    )
}
