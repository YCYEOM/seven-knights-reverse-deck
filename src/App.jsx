import React, { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, CssBaseline, Tabs, Tab, Box } from '@mui/material';
import GuildWarTab from './tabs/GuildWarTab';
import GrowthDungeonTab from './tabs/GrowthDungeonTab';
import RaidTab from './tabs/RaidTab';
import SiegeTab from './tabs/SiegeTab';
import AllOutWarTab from './tabs/AllOutWarTab';
import EquipmentTab from './tabs/EquipmentTab';

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
    // 상단 대분류 탭: 0=길드, 1=파밍, 2=PVP, 3=장비
    const [topTab, setTopTab] = useState(0);
    // 하위 소분류 탭 상태를 대분류별로 보관
    const [subTab, setSubTab] = useState({ guild: 0, farming: 0, pvp: 0, equip: 0 });

    const groupKey = topTab === 0 ? 'guild' : topTab === 1 ? 'farming' : topTab === 2 ? 'pvp' : 'equip';
    const currentSub = subTab[groupKey] || 0;
    const handleTopChange = (e, v) => setTopTab(v);
    const handleSubChange = (e, v) => setSubTab(prev => ({ ...prev, [groupKey]: v }));
    return (
        <ThemeProvider theme={lolchessTheme}>
            <CssBaseline />
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '2px solid #23243a', mb: 4 }}>
                {/* 상단 대분류 탭 */}
                <Toolbar sx={{ justifyContent: 'center', minHeight: 64 }}>
                    <Tabs value={topTab} onChange={handleTopChange} textColor="primary" indicatorColor="primary" sx={{ minHeight: 48 }}>
                        <Tab label="길드" sx={{ fontWeight: 900, fontSize: 18, minWidth: 120 }} />
                        <Tab label="파밍" sx={{ fontWeight: 900, fontSize: 18, minWidth: 120 }} />
                        <Tab label="PVP" sx={{ fontWeight: 900, fontSize: 18, minWidth: 120 }} />
                        <Tab label="장비" sx={{ fontWeight: 900, fontSize: 18, minWidth: 120 }} />
                    </Tabs>
                </Toolbar>
                {/* 하위 소분류 탭 */}
                <Toolbar sx={{ justifyContent: 'center', minHeight: 56, borderTop: '1px solid #23243a' }}>
                    {groupKey === 'guild' && (
                        <Tabs value={currentSub} onChange={handleSubChange} textColor="secondary" indicatorColor="secondary" sx={{ minHeight: 44 }}>
                            <Tab label="길드전" sx={{ fontWeight: 800, fontSize: 16, minWidth: 120 }} />
                            <Tab label="공성전" sx={{ fontWeight: 800, fontSize: 16, minWidth: 120 }} />
                        </Tabs>
                    )}
                    {groupKey === 'farming' && (
                        <Tabs value={currentSub} onChange={handleSubChange} textColor="secondary" indicatorColor="secondary" sx={{ minHeight: 44 }}>
                            <Tab label="성장던전" sx={{ fontWeight: 800, fontSize: 16, minWidth: 120 }} />
                            <Tab label="레이드" sx={{ fontWeight: 800, fontSize: 16, minWidth: 120 }} />
                        </Tabs>
                    )}
                    {groupKey === 'pvp' && (
                        <Tabs value={currentSub} onChange={handleSubChange} textColor="secondary" indicatorColor="secondary" sx={{ minHeight: 44 }}>
                            <Tab label="총력전" sx={{ fontWeight: 800, fontSize: 16, minWidth: 120 }} />
                        </Tabs>
                    )}
                    {groupKey === 'equip' && (
                        <Tabs value={currentSub} onChange={handleSubChange} textColor="secondary" indicatorColor="secondary" sx={{ minHeight: 44 }}>
                            <Tab label="장비추천" sx={{ fontWeight: 800, fontSize: 16, minWidth: 120 }} />
                        </Tabs>
                    )}
                </Toolbar>
            </AppBar>

            {/* 컨텐츠 렌더링 */}
            <Box sx={{ px: 2 }}>
                {groupKey === 'guild' && (
                    currentSub === 0 ? <GuildWarTab /> : <SiegeTab />
                )}
                {groupKey === 'farming' && (
                    currentSub === 0 ? <GrowthDungeonTab /> : <RaidTab />
                )}
                {groupKey === 'pvp' && (
                    <AllOutWarTab />
                )}
                {groupKey === 'equip' && (
                    <EquipmentTab />
                )}
            </Box>
        </ThemeProvider>
    );
}
