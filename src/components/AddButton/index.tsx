import { useCallback, useEffect, useState } from "react";

import { ImageButton } from "./components/ImageButton";
import "./styles.scss";
import Button from "../controls/Button";
import TableIcon from "../../icons/toolbar/table.svg";
import HrIcon from "../../icons/toolbar/horRule.svg";
import { useEditor } from "../../context/LexicalContext";
import { TAGS } from "../../utils/constants";
import { Preview } from "../Preview";

export const AddButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { editor } = useEditor();

  const handleClickHr = useCallback(() => {
    editor.triggerTagUpdate(TAGS.HR);
  }, []);

  return (
    <>
      <div
        className={`add-button__top-selection ${
          isOpen
            ? "add-button__top-selection_active"
            : "add-button__top-selection_not-active"
        }`}
      >
        <ul className="add-button__list">
          <li className="add-button__list-item">
            <ImageButton />
            <Button
              Icon={TableIcon}
              theme="icon"
              className="add-button__button"
            />
            <Button
              Icon={HrIcon}
              theme="icon"
              className="add-button__button"
              onClick={handleClickHr}
            />
          </li>
        </ul>
      </div>
      <button className="add-button" onClick={() => setIsOpen((prev) => !prev)}>
        +
      </button>
    </>
  );
};
