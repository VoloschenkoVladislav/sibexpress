import React, { useState, useRef, FC, useEffect } from "react";
import suneditor from "suneditor";
import { ru } from "suneditor/src/lang";
import plugins from "suneditor/src/plugins";
import "suneditor/dist/css/suneditor.min.css";
import { usePrevious } from "../../hooks/prevProps";


interface Props {
    contents?: string;
    onBlur?: Function;
    onSave: Function;
}

export const SEditor: FC<Props> = props => {

    const { contents, onBlur, onSave } = props;
    const prevContents = usePrevious(contents);
    const txtArea = useRef();
    const [ imageList, setImageList ] = useState<Record<string, string>[]>([]);
    const [ selectedImages, setSelectedImages ] = useState<number[]>([]);
    const [ imageSize, setImageSize ] = useState("0KB");
    let editor: any;

    useEffect(() => {
        // @ts-ignore
        editor = suneditor.create(txtArea.current, {
            plugins: plugins,
            lang: ru,
            callBackSave: (contents: string) => onSave(contents),
            stickyToolbar: 0,
            width: '100%',
            height: 'auto',
            minHeight: '400px',
            value: contents,
            imageMultipleFile: true,
            previewTemplate: `
                <div style="width:auto; max-width:1136px; min-height:400px; margin:auto;">
                {{contents}}
                </div>
            `,
            buttonList: [
                // default
                ['undo', 'redo'],
                ['font', 'fontSize', 'formatBlock'],
                ['paragraphStyle', 'blockquote'],
                ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                ['fontColor', 'hiliteColor', 'textStyle'],
                ['removeFormat'],
                ['outdent', 'indent'],
                ['align', 'horizontalRule', 'list', 'lineHeight'],
                ['table', 'link', 'image', 'video'],
                ['fullScreen', 'showBlocks', 'codeView'],
                ['preview'],
                ['save'],
                // responsive
                ['%1161', [
                    ['undo', 'redo'],
                    [':p-Formats-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['-right', 'save'],
                    ['-right', ':i-Etc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview'],
                    ['-right', ':r-Table&Media-default.more_plus', 'table', 'link', 'image', 'video'],
                ]],
                ['%893', [
                    ['undo', 'redo'],
                    [':p-Formats-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                    ['bold', 'underline', 'italic', 'strike'],
                    [':t-Fonts-default.more_text', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['-right', 'save'],
                    ['-right', ':i-Etc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview'],
                    ['-right', ':r-Table&Media-default.more_plus', 'table', 'link', 'image', 'video'],
                ]],
                ['%855', [
                    ['undo', 'redo'],
                    [':p-Formats-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                    [':t-Fonts-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    [':r-Table&Media-default.more_plus', 'table', 'link', 'image', 'video'],
                    ['-right', 'save'],
                    ['-right', ':i-Etc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview'],
                ]],
                ['%563', [
                    ['undo', 'redo'],
                    [':p-Formats-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                    [':t-Fonts-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    [':e-List&Line-default.more_horizontal', 'align', 'horizontalRule', 'list', 'lineHeight'],
                    [':r-Table&Media-default.more_plus', 'table', 'link', 'image', 'video'],
                    ['-right', 'save'],
                    ['-right', ':i-Etc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview'],
                ]],
                ['%458', [
                    ['undo', 'redo'],
                    [':p-Formats-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
                    [':t-Fonts-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
                    [':e-List&Line-default.more_horizontal', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'lineHeight'],
                    [':r-Table&Media-default.more_plus', 'table', 'link', 'image', 'video'],
                    ['-right', 'save'],
                    ['-right', ':i-Etc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview'],
                ]]
            ]
        });

        editor.onBlur = () => {
            if (typeof onBlur === 'function') {
                onBlur();
            }
        }

        editor.onImageUpload = imageUpload.bind(this);

        return () => {
            if (editor) {
                editor.destroy();
            }
        }
        // editor.onVideoUpload = videoUpload;
    }, []);

    useEffect(() => {
        if (contents !== prevContents) {
            editor.setContents(contents);
            editor.core.history.reset(true);
        }
    });

    // image, video
    const findIndex = (arr: any[], index: number) => {
        let idx = -1;
    
        arr.some(function (a, i) {
            if ((typeof a === 'number' ? a : a.index) === index) {
                idx = i;
                return true;
            }
            return false;
        })
    
        return idx;
    }
    
    const imageUpload = (targetElement: Element, index: number, state: string, imageInfo: Record<string, string>, remainingFilesCount: number) => {
        if (state === 'delete') {
            setImageList(imageList.splice(findIndex(imageList, index), 1));
        } else {
            if (state === 'create') {
                const imageListTemp = imageList;
                imageListTemp.push(imageInfo);
                setImageList(imageListTemp);
            } else { // update
                //
            }
        }

        if (remainingFilesCount === 0) {
            setImageListWithSize()
        }
    }

    const setImageListWithSize = () => {   
        let size = 0;

        for (let i = 0; i < imageList.length; i++) {
            // @ts-ignore
            size += Number((imageList[i].size / 1000).toFixed(1));
        }

        setImageSize(size.toFixed(1) + 'KB');
    }

    const selectImage = (evt: any, type: string, index: number) => {
        evt.preventDefault();
        evt.stopPropagation();
        // @ts-ignore
        imageList[findIndex(imageList, index)][type]();
    }

    const checkImage = (index: number) => {
        const selectedImagesTemp = selectedImages;
        const currentImageIdx = findIndex(selectedImages, index)

        if (currentImageIdx > -1) {
            selectedImagesTemp.splice(currentImageIdx, 1)
        } else {
            selectedImagesTemp.push(index)
        }

        setSelectedImages(selectedImagesTemp);
    }

    const deleteCheckedImages = () => {
        const imagesInfo = editor.getImagesInfo();

        for (let i = 0; i < imagesInfo.length; i++) {
            if (selectedImages.indexOf(imagesInfo[i].index as number) > -1) {
                imagesInfo[i].delete();
                i--;
            }
        }

        setSelectedImages([]);
    }

    const fileUploadToEditor = (e: any) => {
        if (e.target.files) {
            editor.insertImage(e.target.files)
            e.target.value = ''
        }
    }

    return <div>
        {/* @ts-ignore */}
        <textarea ref={txtArea} />
    </div>;
}
