import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Assignment, GetApp, Image as ImageIcon } from '@material-ui/icons';
import streamSaver from 'streamsaver';

import { ARTICLE_GIFS, ARTICLE_IMAGES } from 'core/selector';
import { setClose, setContextSnack } from 'menu/ContextMenu/slice';
import { useParser } from 'util/Parser';

import Info from './FeatureInfo';
import { getGifInfo, getImageInfo } from './func';
import format from './format';

function ContextMenu({ triggerList }) {
  const dispatch = useDispatch();
  const {
    storage: { fileName },
  } = useSelector((state) => state[Info.ID]);
  const infoString = useParser();
  const data = useRef(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const trigger = (target) => {
      if (!target.closest(`${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`)) {
        data.current = null;
        setValid(false);
        return false;
      }

      data.current =
        target.tagName === 'IMG' ? getImageInfo(target) : getGifInfo(target);
      setValid(true);
      return true;
    };

    triggerList.current.push(trigger);
  }, [triggerList]);

  const handleClipboard = useCallback(() => {
    (async () => {
      const { orig } = data.current;

      try {
        dispatch(setClose());
        dispatch(setContextSnack({ msg: '이미지를 다운로드 받는 중...' }));
        const rawData = await fetch(orig).then((response) => response.blob());

        const canvas = document.createElement('canvas');
        const canvasContext = canvas.getContext('2d');
        const convertedBlob = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            canvasContext.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              resolve(blob);
            });
          };
          img.src = URL.createObjectURL(rawData);
        });
        canvas.remove();
        const item = new ClipboardItem({
          [convertedBlob.type]: convertedBlob,
        });
        navigator.clipboard.write([item]);
        dispatch(
          setContextSnack({
            msg: '클립보드에 이미지가 복사되었습니다.',
            time: 3000,
          }),
        );
      } catch (error) {
        console.warn('다운로드 실패', orig, error);
        dispatch(
          setContextSnack({
            msg: '이미지 다운로드에 실패했습니다.',
            time: 3000,
          }),
        );
      }
    })();
  }, [dispatch]);

  const handleDownload = useCallback(() => {
    (async () => {
      const { orig, ext, uploadName } = data.current;
      try {
        dispatch(setClose());
        const response = await fetch(orig);
        const size = Number(response.headers.get('Content-Length'));
        const stream = response.body;
        const name = format(fileName, {
          values: infoString,
          fileName: uploadName,
        });

        const filestream = streamSaver.createWriteStream(`${name}.${ext}`, {
          size,
        });
        stream.pipeTo(filestream);
      } catch (error) {
        console.warn('다운로드 실패', orig, error);
        dispatch(
          setContextSnack({
            msg: '이미지 다운로드에 실패했습니다.',
            time: 3000,
          }),
        );
      }
    })();
  }, [dispatch, fileName, infoString]);

  const handleCopyURL = useCallback(() => {
    dispatch(setClose());
    navigator.clipboard.writeText(data.current.orig);
  }, [dispatch]);

  if (!valid) return null;
  return (
    <List>
      <MenuItem onClick={handleClipboard}>
        <ListItemIcon>
          <Assignment />
        </ListItemIcon>
        <Typography>클립보드로 복사</Typography>
      </MenuItem>
      <MenuItem onClick={handleDownload}>
        <ListItemIcon>
          <GetApp />
        </ListItemIcon>
        <Typography>이미지 저장</Typography>
      </MenuItem>
      <MenuItem onClick={handleCopyURL}>
        <ListItemIcon>
          <ImageIcon />
        </ListItemIcon>
        <Typography>이미지 주소 복사</Typography>
      </MenuItem>
    </List>
  );
}

export default ContextMenu;
