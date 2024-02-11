import React from 'react';
import { useSelector } from 'react-redux';
import { GlobalStyles } from '@mui/material';

import Info from './FeatureInfo';

/* eslint-disable react/prop-types */

// ------------- 사이트 -------------
function NotifyPositionStyles({ value }) {
  return (
    <GlobalStyles
      styles={{
        '.body #toastbox': {
          right: value.indexOf('left') > -1 ? 'initial !important' : undefined,
          height:
            value.indexOf('top') > -1 ? 'calc(100% - 4rem - 52px)' : undefined,
        },
      }}
    />
  );
}

function TopNewsStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        'li.topbar-area': {
          display: 'none !important',
        },
      }}
    />
  );
}

function SearchBarStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        'html li.nav-channel-search-wrapper': {
          display: 'none !important',
        },
      }}
    />
  );
}

function RecentVisitStyles({ value }) {
  let styles;
  switch (value) {
    case 'beforeAd':
      styles = {
        '.board-article-list, .included-article-list': {
          display: 'flex',
          flexDirection: 'column',
          '& .board-title': {
            order: -99,
          },
          '& .board-title+.btns-board': {
            order: -98,
            marginBottom: '0.5rem',
          },
          '& .channel-visit-history': {
            order: -50,
            marginBottom: '0.5rem',
          },
        },
      };
      break;
    case 'afterAd':
      styles = {
        '.board-article-list, .included-article-list': {
          display: 'inherit',
          '& .channel-visit-history': {
            display: 'inherit',
          },
        },
      };
      break;
    case 'none':
      styles = {
        '.board-article-list, .included-article-list': {
          '& .channel-visit-history': {
            display: 'none',
          },
        },
      };
      break;
    default:
      styles = {
        '.board-article-list': {
          display: 'inherit',
          '& .channel-visit-history': {
            display: 'inherit',
          },
        },
      };
      break;
  }
  return <GlobalStyles styles={styles} />;
}

function SideMenuStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={(theme) => {
        const widthEntries = [1100, 1200, 1300, 1500, 1600].map((w) => [
          `html.width-${w}`,
          {
            '& .body .content-wrapper:not(.no-sidebar)': {
              [theme.breakpoints.up(w + 400)]: {
                gridTemplateColumns: 'auto 1fr !important',
              },
              [theme.breakpoints.down(w + 400)]: {
                gridTemplateColumns: '1fr !important',
              },
            },
          },
        ]);

        return {
          ...Object.fromEntries(widthEntries),
          'html:not([class*=width])': {
            '& .body .content-wrapper': {
              gridTemplateColumns: '1fr !important',
            },
          },
          'html .board-article': {
            margin: 0,
          },
          'html .right-sidebar': {
            display: 'none',
          },
        };
      }}
    />
  );
}

function SideContentsStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        '.sidebar .sidebar-item:first-child': {
          display: 'none !important',
        },
      }}
    />
  );
}

function SideBestsStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        '.sidebar .sidebar-item:nth-child(2)': {
          display: 'none !important',
        },
      }}
    />
  );
}

function SideNewsStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        '#newsRank': {
          display: 'none !important',
        },
      }}
    />
  );
}

function AvatarStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        '.avatar': {
          display: 'none !important',
        },
        '.input-wrapper > .input': {
          width: 'calc(100% - 5rem) !important',
        },
      }}
    />
  );
}

// ------------- 게시판 -------------
function UserInfoWidthStyles({ value }) {
  return (
    <GlobalStyles
      styles={{
        '.vcol.col-author': {
          width: `calc(7rem * (1 + ${value * 0.01})) !important`,
        },
      }}
    />
  );
}

function RateCount({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        'html body.body .board-article .article-list .list-table': {
          '& .vrow-inner .vrow-bottom .vcol.col-view': {
            '&::after': {
              content: '""',
              margin: 0,
            },
            marginRight: 0,
          },
          '& .vcol.col-rate': {
            display: 'none !important',
          },
        },
      }}
    />
  );
}

// ------------- 게시물 -------------
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

// ------------- 댓글 -------------
function UnfoldLongCommentStyles({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '#comment': {
          '& .message': {
            maxHeight: 'none !important',
          },
          '& .btn-more': {
            display: ' none !important',
          },
        },
      }}
    />
  );
}

function ModifiedIndicatorStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        'b.modified': {
          display: 'none',
        },
      }}
    />
  );
}

function ReverseCommentStyles({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '#comment': {
          display: 'flex',
          flexDirection: 'column',
          '& .title': {
            order: 0,
          },
          '& #commentForm': {
            order: 1,
          },
          '& .list-area': {
            order: 2,
          },
        },
      }}
    />
  );
}

function HideVoiceComment({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '#comment .btn-voicecmt': {
          display: 'none !important',
        },
      }}
    />
  );
}

function ResizeEmoticonPalette({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '.namlacon': {
          height: 'auto !important',
          '& .emoticons': {
            maxHeight: `${value * 100}px !important`,
          },
        },
      }}
    />
  );
}

// ------------- 접근성 -------------
function FontSizeStyles({ value }) {
  return (
    <GlobalStyles
      styles={{
        fontSize: value,
      }}
    />
  );
}

function FixDarkModeWriteFormStyles({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '.write-body .dark-theme': {
          '&.fr-box.fr-basic .fr-wrapper': {
            border: '1px solid var(--color-bd-outer)',
            borderBottom: 'none',
            background: 'var(--color-bg-body)',
          },
          '&.fr-box.fr-basic .fr-element': {
            color: 'var(--color-text)',
          },
          '& .fr-second-toolbar': {
            background: '#353535',
            border: '1px solid var(--color-bd-outer)',
            color: 'var(--color-text)',
          },
        },
      }}
    />
  );
}

/* eslint-enable react/prop-types */

export default function LayoutCustom() {
  const {
    enabled,
    notifyPosition,
    topNews,
    searchBar,
    recentVisit,
    sideMenu,
    sideContents,
    sideBests,
    sideNews,
    avatar,
    userinfoWidth,
    rateCount,
    hideDefaultImage,
    resizeImage,
    resizeVideo,
    hideUnvote,
    unfoldLongComment,
    modifiedIndicator,
    reverseComment,
    hideVoiceComment,
    resizeEmoticonPalette,
    fontSize,
    fixDarkModeWriteForm,
  } = useSelector((state) => state[Info.ID].storage);

  if (!enabled) return null;

  return (
    <>
      <NotifyPositionStyles value={notifyPosition} />
      <TopNewsStyles value={topNews} />
      <SearchBarStyles value={searchBar} />
      <RecentVisitStyles value={recentVisit} />
      <SideMenuStyles value={sideMenu} />
      <SideContentsStyles value={sideContents} />
      <SideBestsStyles value={sideBests} />
      <SideNewsStyles value={sideNews} />
      <AvatarStyles value={avatar} />
      <UserInfoWidthStyles value={userinfoWidth} />
      <RateCount value={rateCount} />
      <HideDefaultImageStyles value={hideDefaultImage} />
      <ResizeImageStyles value={resizeImage} />
      <ResizeVideoStyles value={resizeVideo} />
      <HideUnvoteStyles value={hideUnvote} />
      <UnfoldLongCommentStyles value={unfoldLongComment} />
      <ModifiedIndicatorStyles value={modifiedIndicator} />
      <ReverseCommentStyles value={reverseComment} />
      <HideVoiceComment value={hideVoiceComment} />
      <ResizeEmoticonPalette value={resizeEmoticonPalette} />
      <FontSizeStyles value={fontSize} />
      <FixDarkModeWriteFormStyles value={fixDarkModeWriteForm} />
    </>
  );
}
