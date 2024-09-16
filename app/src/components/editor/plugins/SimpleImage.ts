import { API, BlockAPI } from '@editorjs/editorjs';
import './SimpleImage.css';
import { BASE_BACKEND_URL } from '../../../constants/baseUrl';


export interface SimpleImageData {
  src?: string,
};

interface ConstructorArgs {
  data: SimpleImageData | {},
  api: API,
  block: BlockAPI,
  config?: {
    onButtonPressed: (editor: SimpleImage) => void, 
    onImageAdded: () => Promise<string>,
  },
  readOnly: boolean,
};

export default class SimpleImage {
  private _data: SimpleImageData;
  private api: API;
  private block: BlockAPI;
  private config: {
    onImageAdded: () => Promise<string>,
    onButtonPressed: (editor: SimpleImage) => void, 
  } | undefined;
  private readOnly: boolean;

  static get toolbox() {
    return {
      title: 'Image',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  constructor({ data, config, api, block, readOnly }: ConstructorArgs) {
    this.api = api;
    this.config = config;
    this.block = block;
    this.readOnly = readOnly;
    this._data = this.normalizeData(data);
  }

  static get isReadOnlySupported(): boolean {
    return true;
  }

  isImageData(data: any): data is SimpleImageData {
    return (data as SimpleImageData).src !== undefined;
  }

  normalizeData(data: SimpleImageData | {}): SimpleImageData {
    const newData: SimpleImageData = { src: undefined };

    if (this.isImageData(data)) {
      newData.src = data.src;
    }

    return newData;
  }

  render(): HTMLImageElement | HTMLDivElement {
    const button = document.createElement('button');
    button.innerHTML = 'Выбрать изображение';
    button.className = 'ce-simple_image__button';

    const buttonWrap = document.createElement('div');
    buttonWrap.className = 'ce-simple_image__buttonwrap';
    buttonWrap.appendChild(button);

    button.addEventListener('click', event => {
      event.preventDefault();
      this.config?.onButtonPressed(this);
    });

    if (this._data.src === undefined) {
      this.config?.onButtonPressed(this);
    } else if (!this._data.src) {
      this._data.src = '';
    }

    const img = document.createElement('img');
    img.className = 'ce-simple_image__image';
    img.src = this._data.src ? `${BASE_BACKEND_URL}/${this._data.src}` : '';
    return this._data.src ? img : buttonWrap;
  }

  save(): SimpleImageData {
    return {
      src: this._data.src,
    };
  }

  get id() {
    return this.block.id;
  }

  public setImage(src: string) {
    this._data.src = src;
    (async () => {
      const data = await this.api.saver.save();
      if (data) {
        this.block.dispatchChange();
        this.api.blocks.render(data);
      }
    })()
  }
}
