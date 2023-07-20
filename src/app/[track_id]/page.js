'use client';
import React from 'react';
import Player from '../../components/player';

export default function Page(props) {
    return (
        <Player track_id={props.params.track_id}/>
    );
}
