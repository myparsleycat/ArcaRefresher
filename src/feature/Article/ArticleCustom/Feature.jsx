import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  GlobalStyles,
  IconButton,
  Portal,
  Tooltip,
} from '@mui/material';
import { ZoomIn } from '@mui/icons-material';

import {
  ARTICLE_GIFS,
  ARTICLE_IMAGES,
  ARTICLE_LOADED,
  ARTICLE,
} from 'core/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

import Info from './FeatureInfo';

const PREVIEW_SELECTOR =
  '.article-content img:not(.twemoji), .article-content video';

/* eslint-disable react/prop-types */
function HideDefaultImageStyles({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '#defaultImage': {
          display: 'none',
        },
      }}
    />
  );
}

function ResizeImageStyles({ value }) {
  return (
    <GlobalStyles
      styles={{
        '.article-body': {
          '& img, & video:not([controls])': {
            '&:not([class$="emoticon"])': {
              maxWidth: `${value}% !important`,
            },
          },
        },
      }}
    />
  );
}

function ResizeVideoStyles({ value }) {
  return (
    <GlobalStyles
      styles={{
        '.article-body video[controls]': {
          maxWidth: `${value}% !important`,
        },
      }}
    />
  );
}

function HideUnvoteStyles({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '#rateDownForm': {
          display: 'none',
        },
      }}
    />
  );
}

/* eslint-enable react/prop-types */

export default function ArticleCustom() {
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);

  const {
    // 모양
    hideDefaultImage,
    resizeImage,
    resizeVideo,
    hideUnvote,
    // 동작
    blockMediaNewWindow,
    ignoreExternalLinkWarning,
    ratedownGuard,
  } = useSelector((state) => state[Info.id].storage);
  const [article, setArticle] = useState(null);
  const confirmRef = useRef();
  const [confirm, setConfirm] = useState(false);
  const [fakePreview, setFakePreview] = useState(null);

  // 게시물 로드 확인 및 엘리먼트 저장
  useEffect(() => {
    if (articleLoaded) {
      setArticle(document.querySelector(ARTICLE));
    }
  }, [articleLoaded]);

  // 이미지, 영상 새 창에서 열기 방지
  useEffect(() => {
    if (!article || !blockMediaNewWindow) return;

    article
      .querySelectorAll(`${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`)
      .forEach((i) => {
        const a = document.createElement('a');
        i.insertAdjacentElement('beforebegin', a);
        a.append(i);
      });
  }, [article, blockMediaNewWindow]);

  // 외부 링크 경고 무시
  useEffect(() => {
    if (!article || !ignoreExternalLinkWarning) return;

    article.querySelectorAll('a.external').forEach((e) => {
      e.href = e.href.replace('https://oo.pe/', '');
      e.classList.remove('external');
    });
  }, [article, ignoreExternalLinkWarning]);

  // 비추천 방지
  const handleConfirm = useCallback(
    (value) => async () => {
      if (!confirmRef.current) return; // ?
      setConfirm(false);
      confirmRef.current(value);
    },
    [],
  );

  useEffect(() => {
    if (!article || !ratedownGuard) return null;

    const ratedownButton = article.querySelector('#rateDown');
    if (!ratedownButton) return null;

    const ratedownClick = async (e) => {
      if (confirmRef.current) {
        // 이미 비추천 막고 있음
        confirmRef.current = undefined;
        return;
      }

      e.preventDefault();
      setConfirm(true);
      const value = await new Promise((resolve) => {
        confirmRef.current = resolve;
      });

      if (value) {
        ratedownButton.click();
        return;
      }
      confirmRef.current = undefined;
    };

    ratedownButton.addEventListener('click', ratedownClick);
    return () => ratedownButton.removeEventListener('click', ratedownClick);
  }, [article, handleConfirm, ratedownGuard]);

  // 미리보기 훼이크 걷어내기
  useEffect(() => {
    if (!article) return;

    const preview = article.querySelector(PREVIEW_SELECTOR);
    if (!preview) return;

    const computedStyle = window.getComputedStyle(preview);
    const display = computedStyle.getPropertyValue('display');
    if (display === 'none') return;

    const width = parseInt(computedStyle.getPropertyValue('width'), 10);
    const height = parseInt(computedStyle.getPropertyValue('height'), 10);

    if (width < 10 && height < 10) {
      const alterParent = document.createElement('span');
      preview.parentElement.insertAdjacentElement('afterbegin', alterParent);
      alterParent.append(preview);
      const container = document.createElement('span');
      preview.parentElement.insertAdjacentElement('afterbegin', container);
      setFakePreview({ container, preview });
    }
  }, [article]);

  const handleFakePreview = useCallback(() => {
    setFakePreview(({ preview, container }) => {
      preview.style = { width: '', height: '' };
      preview.parentElement.replaceWith(preview);
      container.remove();
    });
  }, []);

  return (
    <>
      <HideDefaultImageStyles value={hideDefaultImage} />
      <ResizeImageStyles value={resizeImage} />
      <ResizeVideoStyles value={resizeVideo} />
      <HideUnvoteStyles value={hideUnvote} />
      <Dialog open={confirm} onClose={handleConfirm(false)}>
        <DialogTitle>비추천 재확인</DialogTitle>
        <DialogContent>
          비추천을 누르셨습니다. 진짜 비추천하시겠습니까?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm(true)}>예</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm(false)}
          >
            아니오
          </Button>
        </DialogActions>
      </Dialog>
      {fakePreview && (
        <Portal container={fakePreview.container}>
          <Tooltip placement="right" title="미리보기 확대">
            <IconButton onClick={handleFakePreview} size="large">
              <ZoomIn />
            </IconButton>
          </Tooltip>
        </Portal>
      )}
    </>
  );
}
