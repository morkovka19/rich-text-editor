import { useEditor } from "../../context/LexicalContext";
import Popup from "../controls/Popup";

export const Preview = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { editor } = useEditor();

  return (
    <Popup
      title={"Предпросмотр"}
      isOpen={isOpen}
      onClose={onClose}
      content={
        <div dangerouslySetInnerHTML={{ __html: editor.getHTML() || "" }} />
      }
    />
  );
};
