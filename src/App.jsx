import React, { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, CssBaseline, Tabs, Tab } from '@mui/material';
import GuildWarTab from './tabs/GuildWarTab';
import GrowthDungeonTab from './tabs/GrowthDungeonTab';
import RaidTab from './tabs/RaidTab';
import SiegeTab from './tabs/SiegeTab';
import AllOutWarTab from './tabs/AllOutWarTab';

const lolchessTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#3B82F6' }, // blue-500
        secondary: { main: '#A78BFA' }, // purple-400
        background: {
            default: '#181A20',
            paper: '#23243a',
        },
        text: {
            primary: '#F1F5F9',
            secondary: '#A3A3A3',
            disabled: '#6B7280',
        },
    },
    typography: {
        fontFamily: 'Pretendard, Noto Sans KR, sans-serif',
        h3: { fontWeight: 900 },
        h5: { fontWeight: 700 },
        body1: { fontWeight: 500 },
    },
    shape: { borderRadius: 14 },
});

 

export default function App() {
    const [tab, setTab] = useState(0);
    return (
        <ThemeProvider theme={lolchessTheme}>
            <CssBaseline />
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '2px solid #23243a', mb: 4 }}>
                <Toolbar sx={{ justifyContent: 'center', minHeight: 64 }}>
                    <Tabs value={tab} onChange={(e, v) => setTab(v)} textColor="primary" indicatorColor="primary" sx={{ minHeight: 48 }}>
                        <Tab label="길드전" sx={{ fontWeight: 900, fontSize: 18, minWidth: 120 }} />
                        <Tab label="성장던전" sx={{ fontWeight: 900, fontSize: 18, minWidth: 120 }} />
                        <Tab label="레이드" sx={{ fontWeight: 900, fontSize: 18, minWidth: 120 }} />
                        <Tab label="공성전" sx={{ fontWeight: 900, fontSize: 18, minWidth: 120 }} />
                        <Tab label="총력전" sx={{ fontWeight: 900, fontSize: 18, minWidth: 120 }} />
                    </Tabs>
                </Toolbar>
            </AppBar>
            {tab === 0 && <GuildWarTab />}
            {tab === 1 && <GrowthDungeonTab />}
            {tab === 2 && <RaidTab />}
            {tab === 3 && <SiegeTab />}
            {tab === 4 && <AllOutWarTab />}
        </ThemeProvider>
    );
}
