import { AppBar, Toolbar } from '@material-ui/core';
import React, { FunctionComponent, useCallback } from 'react';
import { WorkspaceRouteDispatch } from '../../pluginInterface';
import HitherJobMonitorControl from './HitherJobMonitor/HitherJobMonitorControl';
import ServerStatusControl from './ServerStatusControl';
import SettingsControl from './SettingsControl';


const appBarHeight = 50

type Props = {
    onOpenSettings: () => void
    onOpenJobMonitor: () => void
    workspaceRouteDispatch: WorkspaceRouteDispatch
    logo?: any
}

const homeButtonStyle: React.CSSProperties = {
    paddingBottom: 0, color: 'white', fontFamily: 'sans-serif', fontWeight: 'bold',
    cursor: 'pointer'
}

const ApplicationBar: FunctionComponent<Props> = ({ onOpenSettings, onOpenJobMonitor, workspaceRouteDispatch, logo }) => {
    const handleHome = useCallback(() => {
        workspaceRouteDispatch({type: 'gotoFieldModelsPage'})
    }, [workspaceRouteDispatch])
    return (
        <AppBar position="static" style={{height: appBarHeight, color: 'white'}}>
            <Toolbar>
            {
                logo && (<img src={logo} className="App-logo" alt="logo" height={30} style={{paddingBottom: 5, cursor: 'pointer'}} onClick={handleHome} />)
            }
            &nbsp;&nbsp;&nbsp;<div style={homeButtonStyle} onClick={handleHome}>Labbox Ephys</div>
            <span style={{marginLeft: 'auto'}} />
            <span style={{paddingBottom: 0, color: 'white'}}>
                <SettingsControl onOpenSettings={onOpenSettings} color={'white'} />
                <ServerStatusControl color={'white'} />
                <HitherJobMonitorControl onClick={onOpenJobMonitor} />
            </span>
            </Toolbar>
        </AppBar>
    )
}

export default ApplicationBar