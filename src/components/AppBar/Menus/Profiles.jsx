import React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

const Profiles = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}>
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt="ToanTran.Dev"
            src="https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-1/449147617_496674442783699_4055719331196320820_n.jpg?stp=c344.168.667.667a_dst-jpg_s200x200&_nc_cat=110&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeFBb9UdWKIWSKFH3vRyogFnTIMNMrA16QxMgw0ysDXpDN4rHcxEv34wXA3JTmgMwnwKEvM8qUAJk7WD7FcNL02I&_nc_ohc=ys7Pa506fIQQ7kNvgEwlwho&_nc_ht=scontent.fsgn5-6.fna&_nc_gid=Aaqjr55OcyLztuRXG6N1KIE&oh=00_AYDWKHsEtWMInTtlVf6JptOZBhkU4EMYaLF1xffzRgDebQ&oe=66FD968C"
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-rrofiles"
        aria-labelledby="basic-button-rrofiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
        <MenuItem
          onClick={handleClose}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Profiles;
