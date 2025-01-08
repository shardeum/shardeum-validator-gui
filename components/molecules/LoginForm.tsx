import { SetStateAction, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { GeistSans } from "geist/font";
import { authService, isFirstTimeUserKey } from "../../services/auth.service";
import { useRouter } from "next/router";
import { PasswordInput } from "../atoms/PasswordInput";
import { useGlobals } from "../../utils/globals";
import { useDevice } from "../../context/device";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export const LoginForm: React.FC = () => {
  const { register, handleSubmit, watch, formState } = useForm();
  const [isInputActive, setIsInputActive] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const passwordInput = watch("password");

  const [apiError, setApiError] = useState<Error | null>(null);
  const { apiBase } = useGlobals();

  const router = useRouter();
  const { isMobile } = useDevice();

  const isFirstTimeUser = () => {
    return localStorage.getItem(isFirstTimeUserKey) !== "false";
  };

  useEffect(() => {
    if (passwordInput && passwordInput.length >= 8) {
      setIsInputActive(true);
    } else {
      setIsInputActive(false);
    }
  }, [passwordInput]);

  async function onSubmit({ password }: FieldValues) {
    setApiError(null);
    await authService
      .login(apiBase, password)
      .then(() => {
        if (isFirstTimeUser() && !isMobile) {
          router.replace("/onboarding");
        } else {
          router.replace("/dashboard");
        }
      })
      .catch((error) => {
        setApiError(error as SetStateAction<Error | null>);
      });
  }

  return (
    <div className="flex flex-col shadow-md bg-white border border-gray-100 rounded-md px-2 py-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <label className={GeistSans.className + " block"}>
          <span className="text-gray-900 font-light bg-white">Password</span>
        </label>
        <div>
          <PasswordInput
            inputProps={register("password", {
              minLength: { value: 8, message: "Password must be at least 8 characters" },
            })}
            isInputActive={isInputActive}
            setIsInputActive={setIsInputActive}
          />
          {apiError && (
            <div className="flex text-red-600 items-center mb-5 mt-1">
              <div className={"font-normal text-xs " + GeistSans.className}>
                {apiError.message}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end items-center">
        {!formState.isSubmitting && (
          <>
            {!isInputActive && (
              <div className="relative mr-2">
                <InformationCircleIcon
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
                {showTooltip && (
                  <div className="absolute left-0 bottom-full mb-2 px-3 py-1 text-xs text-white bg-gray-700 rounded-md whitespace-nowrap">
                    Password must be at least 8 characters
                    <div className="absolute top-full left-2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-700"></div>
                  </div>
                )}
              </div>
            )}
            <button
              disabled={formState.isSubmitting || !isInputActive}
              className={
                (isInputActive
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-300") +
                " text-white text-sm font-semibold py-2 px-4 w-40 rounded-md flex justify-center ease-in-out duration-300 " +
                GeistSans.className
              }
              type="submit"
            >
              Connect Securely
            </button>
          </>
        )}
        {formState.isSubmitting && (
          <button
            className="border border-gray-300 rounded px-4 py-2 w-40 flex items-center justify-center text-sm font-medium"
            disabled={true}
          >
            <div className="spinner flex items-center justify-center mr-3">
              <div className="border-2 border-black border-b-white rounded-full h-3.5 w-3.5"></div>
            </div>{" "}
            Confirming
          </button>
        )}
        </div>
      </form>
    </div>
  );
};
