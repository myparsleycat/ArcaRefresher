import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ARTICLE_LOADED, BOARD_LOADED } from 'core/selector';
import { useContent } from 'hooks/Content';
import { useLoadChecker } from 'hooks';
import { useOpenState } from 'menu/ConfigMenu';

import actionTable from './actionTable';
import keyFilter from './keyFilter';
import Info from './FeatureInfo';

export default function ShortKey() {
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);
  const boardLoaded = useLoadChecker(BOARD_LOADED);
  const content = useContent();

  const configOpen = useOpenState();
  const { enabled, keyTable } = useSelector((state) => state[Info.ID].storage);

  useEffect(() => {
    if (!enabled) return undefined;
    if (configOpen) return undefined;

    const activeActionMap = Object.fromEntries(
      actionTable.map(({ action, active, callback }) => [
        action,
        { active, callback },
      ]),
    );
    const keyMap = Object.fromEntries(
      keyTable
        .map(({ action, key }) => {
          const { active, callback } = activeActionMap[action];
          return { key, active, callback };
        })
        .filter(({ active }) => {
          if (articleLoaded) return active.indexOf('article') > -1;
          if (boardLoaded) return active.indexOf('board') > -1;
          return false;
        })
        .map(({ key, callback }) => [key, callback]),
    );

    // 아카 단축키가 keydown 이벤트를 사용함
    const blocker = (e) => {
      if (e.code === 'Enter') return; // 댓글 바로 쓰기 기능
      if (e.code.indexOf('Digit') > -1) return; // 채널 바로가기

      e.stopPropagation();
    };
    const eventListener = (e) => {
      // 검색창 등 텍스트 입력칸
      if (e.target.matches('input[type="text"], textarea, [contenteditable]'))
        return;

      // 조합키
      if (e.ctrlKey || e.altKey || e.shiftKey) return;

      // 기타 기능
      if (keyFilter.test(e.code)) return;

      e.stopPropagation();
      keyMap[e.code]?.(e, content);
    };

    document.addEventListener('keydown', blocker, true);
    document.addEventListener('keyup', eventListener, true);

    return () => {
      document.removeEventListener('keydown', blocker, true);
      document.removeEventListener('keyup', eventListener, true);
    };
  }, [articleLoaded, boardLoaded, enabled, configOpen, keyTable, content]);

  return null;
}
