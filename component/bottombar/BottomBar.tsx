import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FolderIcon from '@mui/icons-material/Folder';

export default function SimpleBottomNavigation() {
    const [value, setValue] = React.useState(0);

    return (
        <Box sx={{ width: '100%', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationAction label="Home" icon={<RestoreIcon />} />
                <BottomNavigationAction label="Chart" icon={<FavoriteIcon />} />
                <BottomNavigationAction label="Calculator" icon={<LocationOnIcon />} />
                <BottomNavigationAction label="Profile" icon={<FolderIcon />} />
            </BottomNavigation>
        </Box>
    );
}
