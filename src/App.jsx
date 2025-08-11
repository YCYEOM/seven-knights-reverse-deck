import React, { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, CssBaseline, Tabs, Tab, Box } from '@mui/material';
import GuildWarTab from './tabs/GuildWarTab.jsx';
import GrowthDungeonTab from './tabs/GrowthDungeonTab.jsx';
import RaidTab from './tabs/RaidTab.jsx';
import SiegeTab from './tabs/SiegeTab.jsx';
import AllOutWarTab from './tabs/AllOutWarTab.jsx';
import EquipmentTab from './tabs/EquipmentTab.jsx';

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
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '2px solid #23243a', mb: { xs: 0, sm: 2 }, top: 0 }}>
                {/* 상단 대분류 탭 */}
                <Toolbar sx={{ justifyContent: { xs: 'flex-start', md: 'center' }, px: { xs: 1, sm: 2 }, minHeight: { xs: 48, sm: 64 }, overflowX: 'auto' }}>
                  <Tabs
                    value={topTab}
                    onChange={handleTopChange}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{ minHeight: 40, '& .MuiTabs-flexContainer': { flexWrap: 'nowrap' }, maxWidth: '100%' }}
                  >
                    <Tab label="길드" sx={{ fontWeight: 900, fontSize: { xs: 19, sm: 18 }, minWidth: { xs: 68, sm: 120 }, p: { xs: 0.25, sm: 1 } }} />
                    <Tab label="파밍" sx={{ fontWeight: 900, fontSize: { xs: 19, sm: 18 }, minWidth: { xs: 68, sm: 120 }, p: { xs: 0.25, sm: 1 } }} />
                    <Tab label="PVP" sx={{ fontWeight: 900, fontSize: { xs: 19, sm: 18 }, minWidth: { xs: 68, sm: 120 }, p: { xs: 0.25, sm: 1 } }} />
                    <Tab label="장비" sx={{ fontWeight: 900, fontSize: { xs: 19, sm: 18 }, minWidth: { xs: 68, sm: 120 }, p: { xs: 0.25, sm: 1 } }} />
                  </Tabs>
                </Toolbar>
                {/* 하위 소분류 탭 */}
                <Toolbar sx={{ justifyContent: { xs: 'flex-start', md: 'center' }, px: { xs: 1, sm: 2 }, minHeight: { xs: 44, sm: 56 }, borderTop: '1px solid #23243a', overflowX: 'auto' }}>
                  {groupKey === 'guild' && (
                    <Tabs
                      value={currentSub}
                      onChange={handleSubChange}
                      textColor="secondary"
                      indicatorColor="secondary"
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                      sx={{ minHeight: 36, '& .MuiTabs-flexContainer': { flexWrap: 'nowrap' }, maxWidth: '100%' }}
                    >
                      <Tab label="길드전" sx={{ fontWeight: 800, fontSize: { xs: 14, sm: 16 }, minWidth: { xs: 60, sm: 100 }, p: { xs: 0.25, sm: 0.75 } }} />
                      <Tab label="공성전" sx={{ fontWeight: 800, fontSize: { xs: 14, sm: 16 }, minWidth: { xs: 60, sm: 100 }, p: { xs: 0.25, sm: 0.75 } }} />
                    </Tabs>
                  )}
                  {groupKey === 'farming' && (
                    <Tabs
                      value={currentSub}
                      onChange={handleSubChange}
                      textColor="secondary"
                      indicatorColor="secondary"
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                      sx={{ minHeight: 36, '& .MuiTabs-flexContainer': { flexWrap: 'nowrap' }, maxWidth: '100%' }}
                    >
                      <Tab label="성장던전" sx={{ fontWeight: 800, fontSize: { xs: 14, sm: 16 }, minWidth: { xs: 60, sm: 100 }, p: { xs: 0.25, sm: 0.75 } }} />
                      <Tab label="레이드" sx={{ fontWeight: 800, fontSize: { xs: 14, sm: 16 }, minWidth: { xs: 60, sm: 100 }, p: { xs: 0.25, sm: 0.75 } }} />
                    </Tabs>
                  )}
                  {groupKey === 'pvp' && (
                    <Tabs
                      value={currentSub}
                      onChange={handleSubChange}
                      textColor="secondary"
                      indicatorColor="secondary"
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                      sx={{ minHeight: 36, '& .MuiTabs-flexContainer': { flexWrap: 'nowrap' }, maxWidth: '100%' }}
                    >
                      <Tab label="총력전" sx={{ fontWeight: 800, fontSize: { xs: 14, sm: 16 }, minWidth: { xs: 60, sm: 100 }, p: { xs: 0.25, sm: 0.75 } }} />
                    </Tabs>
                  )}
                  {groupKey === 'equip' && (
                    <Tabs
                      value={currentSub}
                      onChange={handleSubChange}
                      textColor="secondary"
                      indicatorColor="secondary"
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                      sx={{ minHeight: 36, '& .MuiTabs-flexContainer': { flexWrap: 'nowrap' }, maxWidth: '100%' }}
                    >
                      <Tab label="장비추천" sx={{ fontWeight: 800, fontSize: { xs: 14, sm: 16 }, minWidth: { xs: 60, sm: 100 }, p: { xs: 0.25, sm: 0.75 } }} />
                    </Tabs>
                  )}
                </Toolbar>
            </AppBar>

            {/* Sticky AppBar offset so content isn't hidden under it */}
            <Box sx={{ height: { xs: 96, sm: 72, md: 8 }, mb: { xs: 0, sm: 0 } }} />

            {/* 컨텐츠 렌더링 */}
            <Box sx={{ px: { xs: 1, sm: 2 }, py: { xs: 0.5, sm: 2 }, maxWidth: 1280, mx: 'auto', width: '100%' }}>
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
