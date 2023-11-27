import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';

import {
  ARTICLE_AUTHOR,
  ARTICLE_LOADED,
  ARTICLE_TITLE,
  ARTICLE_URL,
  BOARD_LOADED,
  CHANNEL_TITLE_LOADED,
  NAVIGATION_LOADED,
} from 'core/selector';
import { convertImgToAlt } from 'func/emoji';
import { getUserNick } from 'func/user';

import { useLoadChecker } from './LoadChecker';

const pathToken = window.location.pathname.split('/');
pathToken.shift(); // ''
const pageType = pathToken.shift();
let channelID = pathToken.shift();
let channelName;
switch (pageType) {
  case 'b':
    // Nothing
    break;
  case 'e':
    channelID = 'emoticon';
    channelName = '아카콘';
    break;
  default:
    channelID = 'ArcaLive';
    channelName = '아카라이브';
    break;
}

const initialState = {
  user: undefined,
  channel: {
    ID: channelID,
    name: channelName,
  },
  board: undefined,
  article: undefined,
};

const HOOK_NAME = 'Content';
const slice = createSlice({
  name: HOOK_NAME,
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setChannel(state, action) {
      state.channel = action.payload;
    },
    setBoard(state, action) {
      state.board = action.payload;
    },
    setArticle(state, action) {
      state.article = action.payload;
    },
  },
});
const { setUser, setChannel, setBoard, setArticle } = slice.actions;
export const ContentReducerEntrie = [HOOK_NAME, slice.reducer];

export function ContentCollector() {
  const dispatch = useDispatch();

  const navLoaded = useLoadChecker(NAVIGATION_LOADED);
  const titleLoaded = useLoadChecker(CHANNEL_TITLE_LOADED);
  const boardLoaded = useLoadChecker(BOARD_LOADED);
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);

  useLayoutEffect(() => {
    if (!navLoaded) return;

    try {
      const userElement = document.querySelector('nav .username > a');
      if (!userElement) {
        return;
      }
      const token = userElement.pathname.split('@')[1].split('/');
      let uniqueId = '';
      if (token.length > 1) {
        uniqueId = `#${token.pop()}`;
      }
      const nick = decodeURI(token.pop());
      dispatch(setUser({ ID: `${nick}${uniqueId}` }));
    } catch (error) {
      console.warn('[ContentInfo] 이용자 정보를 받아오지 못했습니다.');
    }
  }, [dispatch, navLoaded]);

  useLayoutEffect(() => {
    if (!titleLoaded) return;

    try {
      const { channelName: name } = document.querySelector(
        '.board-title .title',
      ).dataset;
      dispatch(
        setChannel({ ID: channelID, name: name.replace(' 채널', '') || '' }),
      );
    } catch (error) {
      console.warn('[ContentInfo] 채널 정보를 받아오지 못했습니다.');
    }
  }, [dispatch, titleLoaded]);

  useLayoutEffect(() => {
    if (!boardLoaded) return;

    try {
      const categoryEntries = [
        ...document.querySelectorAll('.board-category a'),
      ].map((element) => {
        if (!element.href.includes('category='))
          return ['글머리없음', '글머리없음'];

        const id = decodeURI(element.href.split('category=')[1].split('&')[0]);
        const text = element.textContent;

        return [id, text];
      });

      if (categoryEntries.length === 0) throw new Error();

      dispatch(
        setBoard({
          category: Object.fromEntries(categoryEntries),
        }),
      );
    } catch (error) {
      console.warn('[ContentInfo] 카테고리 목록을 얻어오지 못했습니다.');
    }
  }, [dispatch, boardLoaded]);

  useLayoutEffect(() => {
    if (!articleLoaded) return;

    const titleElement = document.querySelector(ARTICLE_TITLE);
    const category =
      titleElement?.querySelector('.badge')?.textContent || '일반';
    const title =
      convertImgToAlt([...(titleElement?.childNodes || [])].slice(2)) ||
      titleElement.textContent.trim() ||
      '제목 없음';
    const author =
      getUserNick(document.querySelector(ARTICLE_AUTHOR)) || '익명';
    const url =
      document.querySelector(ARTICLE_URL)?.href || window.location.href;
    const ID = url.match(/\/(?:(?:b\/[0-9a-z]+)|e)\/([0-9]+)/)[1] || 0;

    dispatch(setArticle({ ID, category, title, author, url }));
  }, [dispatch, articleLoaded]);

  return null;
}

/**
 * 게시판 및 게시물 정보를 받아옵니다.
 * @returns {{
 *  user: {
 *    ID: string,
 *  }
 *  channel: {
 *    ID: string,
 *    name: string,
 *  },
 *  board: {
 *    category: { id: label }
 *  }
 *  article: {
 *    ID: string,
 *    category: string,
 *    title: string,
 *    author: string,
 *    url: string
 *  }
 * }}
 */
export function useContent() {
  const content = useSelector((state) => state[HOOK_NAME]);
  return content;
}
