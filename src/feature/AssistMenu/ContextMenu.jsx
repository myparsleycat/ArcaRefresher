import React, { useCallback, useEffect, useRef, useState } from 'react';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';

function ContextMenu({ triggerList }) {
  const [setOpen] = useContextMenu();
  const data = useRef(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const trigger = (target) => {
      const userInfo = target.closest(USER_INFO);
      if (!userInfo) {
        data.current = null;
        setValid(false);
        return false;
      }

      const id = userInfo?.querySelector('[data-filter]')?.dataset.filter || '';
      data.current = id.replace('#', '/');
      setValid(/^[^,]+$/.test(id));
      return true;
    };

    triggerList.current.push(trigger);
  }, [triggerList]);

  const handleInfo = useCallback(() => {
    window.open(`https://arca.live/u/@${data.current}`);
    setOpen(false);
  }, [setOpen]);

  if (!valid) return null;
  return (
    <List>
      <MenuItem onClick={handleInfo}>
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <Typography>사용자 정보</Typography>
      </MenuItem>
    </List>
  );
}

export default ContextMenu;
