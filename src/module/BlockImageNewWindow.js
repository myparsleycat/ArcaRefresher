import { addSetting, getValue, setValue } from '../core/Configure';
import { CurrentPage } from '../core/Parser';

export default { load };

const BLOCK_IMAGE_NEW_WINDOW = {
  key: 'blockImageNewWindow',
  defaultValue: false,
};

function load() {
  try {
    setupSetting();

    if (CurrentPage.Component.Article) {
      apply();
    }
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const setting = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );
  addSetting({
    header: '컨텐츠 원본보기',
    group: [
      {
        title: '게시물 이미지 비디오 클릭 시 원본보기 방지',
        content: setting,
      },
    ],
    valueCallback: {
      save() {
        setValue(BLOCK_IMAGE_NEW_WINDOW, setting.value === 'true');
      },
      load() {
        setting.value = getValue(BLOCK_IMAGE_NEW_WINDOW);
      },
    },
  });
}

function apply() {
  if (!getValue(BLOCK_IMAGE_NEW_WINDOW)) return;

  const targetElements = document.querySelectorAll(
    '.article-body img, .article-body video:not([controls])'
  );

  for (const element of targetElements) {
    const a = <a />;

    element.insertAdjacentElement('beforebegin', a);
    a.append(element);
  }
}
