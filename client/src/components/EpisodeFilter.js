import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { useDispatch } from "react-redux";
import { setEpisodeFilter } from "../actions/Episodes";
import * as EPISODE_FILTERS from "../constants/EpisodeFilters";
import Button from "@material-ui/core/Button";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";

const filters = [
  EPISODE_FILTERS.SHOW_ALL,
  EPISODE_FILTERS.SHOW_FIRST,
  EPISODE_FILTERS.SHOW_NEXT,
  EPISODE_FILTERS.SHOW_FUTURE
];

const EpisodeFilter = () => {
  const dispatch = useDispatch();
  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(2);

  function handleMenuItemClick(event, index) {
    setSelectedIndex(index);
    setOpen(false);
    dispatch(setEpisodeFilter(filters[index]));
  }

  function handleToggle() {
    setOpen(prevOpen => !prevOpen);
  }

  function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }

  return (
    <div>
      <Button variant="outlined" color="inherit" size="small" onClick={handleToggle} ref={anchorRef}>
        {filters[selectedIndex]}
        <ArrowDropDownIcon />
      </Button>

      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom"
            }}
          >
            <Paper id="menu-list-grow">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  {filters.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={event => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default EpisodeFilter;
