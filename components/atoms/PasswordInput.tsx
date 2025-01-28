import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type PasswordInputProps = {
  inputProps?: object;
  isInputActive: boolean;
};

export const PasswordInput = ({
  inputProps,
  isInputActive,
}: PasswordInputProps) => {
  const [isInputVisible, setIsInputVisible] = useState(false);

  const handleToggle = () => {
    if (isInputVisible) {
      setIsInputVisible(false);
    } else {
      setIsInputVisible(true);
    }
  };

  return (
    <div
      className={
        "flex items-center py-2 px-3 rounded-md border border-b-2 bg-white " +
        (isInputActive ? "border-b-indigo-500" : "")
      }
    >
      <div className="w-full flex justify-between">
        <input
          type={isInputVisible ? "text" : "password"}
          placeholder="Enter Password Here"
          className="outline-none flex-1 bg-white"
          {...inputProps}
        />
        <span>
          {isInputVisible ? (
            <EyeIcon
              className="cursor-pointer h-4 ml-2"
              onClick={handleToggle}
            />
          ) : (
            <EyeSlashIcon
              className="cursor-pointer h-4 ml-2"
              onClick={handleToggle}
            />
          )}
        </span>
      </div>
    </div>
  );
};
