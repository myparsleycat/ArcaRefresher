import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Block, Redo } from '@material-ui/icons';

import { BOARD_ITEMS_WITH_NOTICE, USER_INFO } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { getUserInfo } from 'func/user';

import Info from '../FeatureInfo';
import { $addUser, $removeUser } from '../slice';

function makeRegex(id = '') {
  return `${id.replace('.', '\\.')}$`;
}

function User({ targetRef }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state[Info.ID].storage);

  const [data, closeMenu] = useContextMenu({
    targetRef,
    selector: `${BOARD_ITEMS_WITH_NOTICE}, ${USER_INFO}`,
    dataExtractor: (target) => {
      let userElement = target;
      if (target.matches('.vrow')) {
        userElement = target.querySelector('span.user-info');
      }
      if (!userElement) return undefined;

      const regex = makeRegex(getUserInfo(userElement));
      const exist = user.includes(regex);
      return { regex, exist };
    },
  });

  const handleMute = useCallback(() => {
    const { regex, exist } = data;

    dispatch(exist ? $removeUser(regex) : $addUser(regex));
    closeMenu();
  }, [data, dispatch, closeMenu]);

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleMute}>
        <ListItemIcon>{data.exist ? <Redo /> : <Block />}</ListItemIcon>
        <Typography>
          {data.exist ? '사용자 뮤트 해제' : '사용자 뮤트'}
        </Typography>
      </MenuItem>
    </List>
  );
}

export default User;
