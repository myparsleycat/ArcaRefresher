import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Comment } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { getUserID } from 'func/user';

import { $setMemo } from '../slice';
import Info from '../FeatureInfo';
import MemoInput from './MemoInput';

function ContextMenu({ triggerList }) {
  const dispatch = useDispatch();
  const [setOpen] = useContextMenu();
  const {
    storage: { memo },
  } = useSelector((state) => state[Info.ID]);
  const [openInput, setOpenInput] = useState(false);
  const data = useRef(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const trigger = (target) => {
      if (!target.closest(USER_INFO)) {
        data.current = null;
        setValid(false);
        return false;
      }

      const userInfo = target.closest(USER_INFO);
      const id = getUserID(userInfo);
      data.current = id;
      setValid(true);
      return true;
    };

    triggerList.current.push(trigger);
  }, [triggerList]);

  const handleClick = useCallback(() => {
    setOpen(false);
    setOpenInput(true);
  }, [setOpen]);

  const handleInputClose = useCallback(() => {
    setOpenInput(false);
  }, []);

  const handleInputSubmit = useCallback(
    (value) => {
      dispatch($setMemo({ user: data.current, memo: value }));
    },
    [data, dispatch],
  );

  if (!valid) return null;
  return (
    <List>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>
          <Comment />
        </ListItemIcon>
        <Typography>메모</Typography>
      </MenuItem>
      <MemoInput
        open={openInput}
        defaultValue={memo[data.current]}
        onClose={handleInputClose}
        onSubmit={handleInputSubmit}
      />
    </List>
  );
}

export default ContextMenu;
