import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { BrokenImage, PhotoLibrary } from '@material-ui/icons';

import { ARTICLE_GIFS, ARTICLE_IMAGES } from 'core/selector';
import { useContent } from 'util/ContentInfo';
import { useContextMenu } from 'menu/ContextMenu';

import Info from './FeatureInfo';
import { $addImage, $removeImage } from './slice';

const selector = `${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`;

function ContextMenu({ targetRef }) {
  const dispatch = useDispatch();
  const [open, closeMenu, setSnack] = useContextMenu({
    method: 'closest',
    selector,
  });
  const { channel } = useContent();
  const {
    storage: { imgList },
  } = useSelector((state) => state[Info.ID]);
  const [data, setData] = useState(undefined);

  useEffect(() => {
    if (!open) {
      setData(undefined);
      return;
    }

    if (!targetRef.current.closest(selector)) return;

    const url = targetRef.current.src.split('?')[0];
    const channelExist = imgList[channel.ID]?.includes(url) || false;
    // eslint-disable-next-line dot-notation
    const shareExist = imgList['_shared_']?.includes(url) || false;
    setData({ url, channel: channelExist, share: shareExist });
  }, [channel, imgList, open, targetRef]);

  const handleChannelImage = useCallback(() => {
    const action = data.channel ? $removeImage : $addImage;
    dispatch(action({ channel: channel.ID, url: data.url }));
    closeMenu();
    setSnack({
      msg: `채널 자짤${data.channel ? '에서 제거' : '에 저장'}했습니다.`,
      time: 3000,
    });
  }, [data, dispatch, channel, closeMenu, setSnack]);

  const handleShareImage = useCallback(() => {
    const action = data.share ? $removeImage : $addImage;
    dispatch(action({ channel: '_shared_', url: data.url }));
    closeMenu();
    setSnack({
      msg: `공용 자짤${data.share ? '에서 제거' : '에 저장'}했습니다.`,
      time: 3000,
    });
  }, [data, dispatch, closeMenu, setSnack]);

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleChannelImage}>
        <ListItemIcon>
          {data.channel ? <BrokenImage /> : <PhotoLibrary />}
        </ListItemIcon>
        <Typography>
          {data.channel ? '채널 자짤에서 제거' : '채널 자짤로 저장'}
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleShareImage}>
        <ListItemIcon>
          {data.share ? <BrokenImage /> : <PhotoLibrary />}
        </ListItemIcon>
        <Typography>
          {data.share ? '공용 자짤에서 제거' : '공용 자짤로 저장'}
        </Typography>
      </MenuItem>
    </List>
  );
}

export default ContextMenu;
