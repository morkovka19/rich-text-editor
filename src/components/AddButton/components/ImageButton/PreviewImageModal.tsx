import Button from "../../../controls/Button";
import Popup from "../../../controls/Popup";

const PreviewImageModal = ({
  isOpen,
  onClose,
  onInsert,
  onUpdate,
  imagePreview,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInsert: () => void;
  onUpdate: (newWidth: number, newHeight: number, alt: string) => void;
  imagePreview: {
    url: string;
    width: number;
    height: number;
    alt: string;
  } | null;
}) => {
  if (!(imagePreview && isOpen)) return;
  return (
    <Popup
      title="Настройка изображения"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="image__buttons-container">
          <Button
            className="image__button image__button-text"
            onClick={onClose}
            text="Отмена"
            theme="text"
          />
          <Button
            onClick= {() => {
              onInsert();
            }}
            text="Сохранить"
            theme="text"
            className="image__button image__button-text"
          />
        </div>
      }
      content={
        <div className="image__content">
          <div className="image__inputs">
            <div>
              <label className="image__label">Width:</label>
              <input
                min={1}
                type="number"
                value={imagePreview.width}
                onChange={(e) =>
                  onUpdate(
                    Number(e.target.value),
                    imagePreview.height,
                    imagePreview.alt
                  )
                }
                className="image__input"
              />
            </div>
            <div>
              <label className="image__label">Height:</label>
              <input
                min={1}
                type="number"
                value={imagePreview.height}
                onChange={e => onUpdate(imagePreview.width, Number(e.target.value), imagePreview.alt)}
                className="image__input"
              />
            </div>
            <div>
              <label className="image__label">Alt</label>
              <input
                type="text"
                value={imagePreview.alt}
                onChange={(e) =>
                  onUpdate(
                    imagePreview.width,
                    imagePreview.height,
                    e.target.value
                  )
                }
                className="image__input"
              />
            </div>
          </div>
          <div
            style={{
              width: `${imagePreview.width}px`,
              height: `${imagePreview.height}px`,
            }}
            className="image__preview-container"
          >
            <img
              src={imagePreview.url}
              style={{
                width: `${imagePreview.width}px`,
                height: `${imagePreview.height}px`,
              }}
              alt="Preview"
              className="image__preview"
            />
          </div>
        </div>
      }
    />
  );
};

export default PreviewImageModal;
