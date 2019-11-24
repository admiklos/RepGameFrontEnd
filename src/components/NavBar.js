import React from 'react';

// React Router imports
import { Link as RouterLink } from 'react-router-dom';

// Material UI imports
import { AppBar, Toolbar } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { Button, IconButton } from '@material-ui/core';

const Link1 = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

const NavBar = (props) => {

	return (
      <div style={{"flexGrow":"1" }}>
        <AppBar position="static">
          <Toolbar>
              <Typography variant="h6" style={{"flexGrow":"1"}}>
                Welcome {props.player}
              </Typography>
              <Button component={Link1} to="/" color="inherit">Home</Button>
              <Button component={Link1} to="/leader-board" color="inherit">LeaderBoard</Button>
              <IconButton component={Link1} to="/settings" style={{"marginRight": "theme.spacing(2)"}} color="inherit" aria-label="settings">
              <SettingsOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>

	);
}

export default NavBar;