import React, { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import {
  COMMENT_INNER,
  COMMENT_ITEMS,
  COMMENT_WRAPPERS,
  COMMENT_EMOTICON,
  COMMENT_LOADED,
} from 'core/selector';
import { EVENT_COMMENT_REFRESH, useEvent } from 'hooks/Event';
import { useLoadChecker } from 'hooks';
import { getUserInfo } from 'func/user';

import Info from '../FeatureInfo';
import { filterContent } from '../func';
import { emoticonFilterSelector } from '../selector';
import CountBar from './CountBar';

const style = {
  '@global': {
    '.body #comment': {
      '& .frontend-header': {
        display: 'none',
      },
      '& .list-area': {
        '& .comment-wrapper.filtered': {
          display: 'none',
        },
        '&.show-filtered .comment-wrapper.filtered': {
          display: 'block',
        },
        '&.show-filtered-deleted .comment-wrapper.filtered-deleted': {
          display: 'block',
        },
        '&.show-filtered-keyword .comment-wrapper.filtered-keyword': {
          display: 'block',
        },
        '&.show-filtered-user .comment-wrapper.filtered-user': {
          display: 'block',
        },
        '& .emoticon-muted': {
          '& .emoticon-wrapper': {
            width: 'auto !important',
            height: 'auto !important',
            textDecoration: 'none !important',
            '& > img, & > video': {
              display: 'none !important',
            },
          },
        },
        '& .hide-emoticon-muted': {
          display: 'none !important',
        },
      },
    },
  },
};

function CommentMuter() {
  const dispatch = useDispatch();
  const [addEventListener, removeEventListener] = useEvent();
  const commentLoaded = useLoadChecker(COMMENT_LOADED);

  const { user, keyword, hideCountBar, hideMutedMark, muteIncludeReply } =
    useSelector((state) => state[Info.ID].storage);
  const [comment, setComment] = useState(undefined);
  const [container, setContainer] = useState(undefined);
  const [count, setCount] = useState(undefined);
  const emoticonFilter = useSelector(emoticonFilterSelector);

  // 댓글 창 로드 검사 및 컨테이너 생성
  useLayoutEffect(() => {
    if (!commentLoaded) return;

    const commentElement = document.querySelector(COMMENT_INNER);
    if (!commentElement) return;

    setComment(commentElement);

    const countBarContainer = document.createElement('div');
    commentElement.insertAdjacentElement('beforebegin', countBarContainer);
    setContainer(countBarContainer);

    addEventListener(EVENT_COMMENT_REFRESH, () => {
      const refreshedComment = document.querySelector(COMMENT_INNER);
      setComment(refreshedComment);
      refreshedComment.insertAdjacentElement('beforebegin', countBarContainer);
    });
  }, [dispatch, commentLoaded, addEventListener]);

  // 이모티콘 뮤트
  useLayoutEffect(() => {
    if (!commentLoaded) return undefined;

    const muteEmoticon = () => {
      const commentEmot = document.querySelectorAll(COMMENT_EMOTICON);
      commentEmot.forEach((c) => {
        const id = Number(c.dataset.id);
        c.closest(
          muteIncludeReply ? COMMENT_WRAPPERS : COMMENT_ITEMS,
        ).classList.toggle(
          hideMutedMark ? 'hide-emoticon-muted' : 'emoticon-muted',
          !!emoticonFilter.bundle[id],
        );

        if (!emoticonFilter.bundle[id] || hideMutedMark) return;
        const muted = document.createElement('span');
        muted.append('[아카콘 뮤트됨]');
        muted.classList.add('muted');
        muted.title = emoticonFilter.bundle[id];
        c.closest('.emoticon-wrapper').append(muted);
      });
    };

    muteEmoticon();
    addEventListener(EVENT_COMMENT_REFRESH, muteEmoticon);

    return () => {
      const commentEmot = document.querySelectorAll(COMMENT_EMOTICON);
      commentEmot.forEach((c) => {
        c.closest(
          muteIncludeReply ? COMMENT_WRAPPERS : COMMENT_ITEMS,
        ).classList.remove(
          hideMutedMark ? 'hide-emoticon-muted' : 'emoticon-muted',
        );
        c.closest('.emoticon-wrapper').querySelector('span')?.remove();
      });
      removeEventListener(EVENT_COMMENT_REFRESH, muteEmoticon);
    };
  }, [
    commentLoaded,
    emoticonFilter,
    hideMutedMark,
    muteIncludeReply,
    addEventListener,
    removeEventListener,
  ]);

  // 키워드, 이용자 뮤트
  useLayoutEffect(() => {
    if (!comment) return undefined;

    const muteComment = () => {
      const commentList = [
        ...document.querySelectorAll(
          muteIncludeReply ? COMMENT_WRAPPERS : COMMENT_ITEMS,
        ),
      ];
      const commentInfo = commentList.map((c) => ({
        element: c,
        user: getUserInfo(c.querySelector('.user-info')),
        content: c.querySelector('.message')?.textContent || '',
        category: '',
      }));

      const result = filterContent({
        contents: commentInfo,
        userList: user,
        keywordList: keyword,
      });
      setCount(result);
    };

    if (document.readyState === 'complete') muteComment();
    window.addEventListener('load', muteComment);
    addEventListener(EVENT_COMMENT_REFRESH, muteComment);

    return () => {
      window.removeEventListener('load', muteComment);
      removeEventListener(EVENT_COMMENT_REFRESH, muteComment);
    };
  }, [
    comment,
    keyword,
    user,
    muteIncludeReply,
    addEventListener,
    removeEventListener,
  ]);

  if (!container) return null;
  return (
    <CountBar
      renderContainer={container}
      classContainer={comment}
      count={count}
      hide={hideCountBar}
    />
  );
}

export default withStyles(style)(CommentMuter);
