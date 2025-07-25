import React from 'react';
import { Card, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChatIcon from '@mui/icons-material/Chat';

const sidebarItems = [
  { label: 'User Information', icon: <AccountCircleOutlinedIcon /> },
  { label: 'Event Bookings', icon: <EventIcon /> },
  { label: 'Calendar', icon: <CalendarMonthIcon /> },
  { label: 'Chat Room', icon: <ChatIcon /> },
] as const;

type SidebarItem = typeof sidebarItems[number]['label'];

interface ProfileSidebarProps {
  selected: SidebarItem;
  onSelect: (section: SidebarItem) => void;
}

// add new
const ProfileSidebar = React.memo(function ProfileSidebar({ selected, onSelect }: ProfileSidebarProps) {
  return (
    <Box sx={{ width: 260, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {sidebarItems.map((item) => (
        <Card
          key={item.label}
          variant={selected === item.label ? 'elevation' : 'outlined'}
          sx={{ borderRadius: 2, boxShadow: selected === item.label ? 4 : undefined }}
        >
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemButton selected={selected === item.label} onClick={() => onSelect(item.label)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          </List>
        </Card>
      ))}
    </Box>
  );
});

export default ProfileSidebar;