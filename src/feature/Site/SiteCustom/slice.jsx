import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultFavicon = {
  '': '',
  google: 'https://www.google.com/s2/favicons?sz=64&domain=google.com',
  gmail: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
  naver: 'https://www.google.com/s2/favicons?sz=64&domain=naver.com',
  custom: '',
};

const defaultStorage = {
  version: 1,
  // 모양
  notifyPosition: 'right',
  topNews: true,
  searchBar: true,
  recentVisit: 'afterAd',
  sideMenu: true,
  sideContents: true,
  sideBests: true,
  sideNews: true,
  fontSize: 15,
  fixDarkModeWriteForm: true,
  // 동작
  spoofTitle: '',
  presetFavicon: '',
  spoofFavicon: '',
};

function updater(storage, defaultValue) {
  // version 0 => 1
  const version = storage?.version || 0;

  switch (version) {
    case 0: {
      const keys = Object.keys(defaultValue).filter((k) => k !== 'version');
      const entries = [];
      const oldLayoutValues = getValue('LayoutCustom');
      if (oldLayoutValues) {
        entries.push(
          ...Object.entries(oldLayoutValues).filter((pair) =>
            keys.includes(pair[0]),
          ),
        );
      }
      const oldExpValues = getValue('ExperienceCustom');
      if (oldExpValues) {
        entries.push(
          ...Object.entries(oldExpValues).filter((pair) =>
            keys.includes(pair[0]),
          ),
        );
      }

      return { ...defaultValue, ...Object.fromEntries(entries) };
    }
    default:
      console.warn('지원하지 않는 버전 데이터입니다.', storage);
      return defaultValue;
  }
}

const initialState = {
  storage: getValue(Info.id, defaultStorage, updater),
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    // 모양
    $setNotifyPosition(state, action) {
      state.storage.notifyPosition = action.payload;
    },
    $toggleTopNews(state) {
      state.storage.topNews = !state.storage.topNews;
    },
    $toggleSearchBar(state) {
      state.storage.searchBar = !state.storage.searchBar;
    },
    $setRecentVisit(state, action) {
      state.storage.recentVisit = action.payload;
    },
    $toggleSideMenu(state) {
      state.storage.sideMenu = !state.storage.sideMenu;
    },
    $toggleSideContents(state) {
      state.storage.sideContents = !state.storage.sideContents;
    },
    $toggleSideBests(state) {
      state.storage.sideBests = !state.storage.sideBests;
    },
    $toggleSideNews(state) {
      state.storage.sideNews = !state.storage.sideNews;
    },
    $setFontSize(state, action) {
      state.storage.fontSize = action.payload;
    },
    $toggleDarkModeWriteForm(state) {
      state.storage.fixDarkModeWriteForm = !state.storage.fixDarkModeWriteForm;
    },
    // 동작
    $setSpoofTitle(state, action) {
      state.storage.spoofTitle = action.payload;
    },
    $setPresetFavicon(state, action) {
      state.storage.presetFavicon = action.payload;
      state.storage.spoofFavicon = defaultFavicon[action.payload];
    },
    $setSpoofFavicon(state, action) {
      state.storage.spoofFavicon = action.payload;
    },
  },
});

export const {
  // 모양
  $setNotifyPosition,
  $toggleTopNews,
  $toggleSearchBar,
  $setRecentVisit,
  $toggleSideMenu,
  $toggleSideContents,
  $toggleSideBests,
  $toggleSideNews,
  $setFontSize,
  $toggleDarkModeWriteForm,
  // 동작
  $setSpoofTitle,
  $setPresetFavicon,
  $setSpoofFavicon,
} = slice.actions;

export default slice.reducer;
