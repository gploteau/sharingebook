'use client';
import React from 'react';
import Player from '../../components/player';

export default function Page({track_id}) {
    return (
        <Player track_id={track_id}/>
    );
}
