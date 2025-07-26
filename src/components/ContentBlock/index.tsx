/* eslint-disable react-hooks/exhaustive-deps */
import {
  PropsWithChildren,
  RefObject,
  forwardRef,
  useLayoutEffect,
  useState,
} from "react";

import { useFormatting } from "../../context/FormattingContext";
import { useEditor } from "../../context/LexicalContext";
import { STYLE } from "../../utils/constants";
import { getStyleString } from "../../utils/styleUtils";
import "./styles.scss";

export type ContentBlockProps = PropsWithChildren<{
  editorRef?: RefObject<HTMLDivElement>;
  isEditable?: boolean;
}>;

const ContentBlock = forwardRef<ContentBlockProps & HTMLDivElement>(
  ({ isEditable = true }: ContentBlockProps, ref) => {
    const { editor } = useEditor();
    const { style } = useFormatting();

    useLayoutEffect(() => {
      if (ref && "current" in ref) {
        editor.start(ref.current as HTMLElement);
        (ref.current as HTMLElement).setAttribute(STYLE, getStyleString(style));
      }
    }, []);

    return (
      <div
        id="editor"
        contentEditable={isEditable}
        className="content-block"
        suppressContentEditableWarning={isEditable}
        ref={ref}
        children={
          ref && 'current' in ref && Number([...(ref.current?.getElementsByTagName('div')?.item(0)?.children || [])]?.at(0)?.children?.length) > 5 ? (
            <p className="content-block__placeholder">
              Enter some rich text...
            </p>
          ) : undefined
        }
      />
    );
  }
);

export default ContentBlock;
