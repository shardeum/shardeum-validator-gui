import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { usePassword } from "../../hooks/usePasswordChange";
import { Card } from "../layouts/Card";
import { PasswordInput } from "../atoms/PasswordInput";
import { GeistSans } from "geist/font";

type FormData = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

function validPassword(password: string) {
  return (
    password.length >= 8 &&
    password.length <= 128 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*()_+*$]/.test(password)
  );
}

const PasswordResetForm = () => {
  const { register, handleSubmit, formState, setError, reset, watch } =
    useForm<FormData>({
      mode: "onChange",
    });
  const { changePassword, isLoading } = usePassword({ setError });
  const [isCurrentPasswordInputActive, setIsCurrentPasswordInputActive] =
    useState(false);
  const [isNewPasswordInputActive, setIsNewPasswordInputActive] =
    useState(false);
  const [isConfirmNewPasswordInputActive, setIsConfirmNewPasswordInputActive] =
    useState(false);
  const currentPasswordInput = watch("currentPassword");
  const newPasswordInput = watch("newPassword");
  const confirmNewPasswordInput = watch("confirmNewPassword");

  const [areAllInputsActive, setAreAllInputsActive] = useState(false);

  // State for displaying the success alert
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const resetForm = () => {
    reset();
    setIsCurrentPasswordInputActive(false);
    setIsNewPasswordInputActive(false);
    setIsConfirmNewPasswordInputActive(false);
  };

  useEffect(() => {
    if (currentPasswordInput && currentPasswordInput.length > 0) {
      setIsCurrentPasswordInputActive(true);
    } else {
      setIsCurrentPasswordInputActive(false);
    }
    if (newPasswordInput && newPasswordInput.length > 0) {
      setIsNewPasswordInputActive(true);
    } else {
      setIsNewPasswordInputActive(false);
    }
    if (confirmNewPasswordInput && confirmNewPasswordInput.length > 0) {
      setIsConfirmNewPasswordInputActive(true);
    } else {
      setIsConfirmNewPasswordInputActive(false);
    }
  }, [currentPasswordInput, newPasswordInput, confirmNewPasswordInput]);

  useEffect(() => {
    setAreAllInputsActive(
      isCurrentPasswordInputActive &&
        isNewPasswordInputActive &&
        isConfirmNewPasswordInputActive
    );
  }, [
    isCurrentPasswordInputActive,
    isNewPasswordInputActive,
    isConfirmNewPasswordInputActive,
  ]);

  const onSubmit = async (data: FormData) => {
    if (!validPassword(data.newPassword)) {
      setError(
        `newPassword`,
        {
          message: "The password does not meet the requirements!",
        },
        { shouldFocus: true }
      );
    } else if (data.currentPassword == data.newPassword) {
      setError(
        `newPassword`,
        { message: "New password is the same as the current password" },
        { shouldFocus: true }
      );
    } else if (data.confirmNewPassword != data.newPassword) {
      setError(
        `confirmNewPassword`,
        { message: "Doesn't match the New Password" },
        { shouldFocus: true }
      );
    } else {
      await changePassword(data.currentPassword, data.newPassword);
      resetForm();
      setIsPasswordReset(true); // Show success alert

      // Hide the alert after 3 seconds
      setTimeout(() => {
        setIsPasswordReset(false);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <span className="font-semibold">Password Reset</span>
      <p className="text-sm text-gray-500">
        Password requirements: min 8 characters, max 128 characters, at least 1
        lower case letter, at least 1 upper case letter, at least 1 number, at
        least 1 special character (
        <span className="text-sm text-gray-400">{"!@#$%^&*()_+*$"}</span>)
      </p>
      <Card>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full p-5 flex flex-col gap-y-4"
        >
          {/* Show the success alert if password reset is successful */}
          {isPasswordReset && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline">
                {" "}
                Your password has been reset successfully.
              </span>
            </div>
          )}

          <div className="flex flex-col justify-between gap-y-1">
            <label htmlFor="currentPassword" className="text-xs">
              Enter Current Password
            </label>
            <PasswordInput
              inputProps={register("currentPassword", {
                required: "This field is required",
              })}
              isInputActive={isCurrentPasswordInputActive}
              setIsInputActive={setIsCurrentPasswordInputActive}
            />
            <span className="text-right text-sm text-warning">
              {formState.errors.currentPassword && (
                <p>{formState.errors.currentPassword.message}</p>
              )}
            </span>
          </div>

          <div className="flex flex-col justify-between gap-y-1">
            <label htmlFor="newPassword" className="text-xs">
              Enter New Password
            </label>
            <PasswordInput
              inputProps={register("newPassword", {
                required: "This field is required",
              })}
              isInputActive={isNewPasswordInputActive}
              setIsInputActive={setIsNewPasswordInputActive}
            />
            <span className="text-right text-sm text-warning">
              {formState.errors.newPassword && (
                <p>{formState.errors.newPassword.message}</p>
              )}
            </span>
          </div>

          <div className="flex flex-col justify-between gap-y-1">
            <label htmlFor="confirmNewPassword" className="text-xs">
              Re-Enter New Password
            </label>
            <PasswordInput
              inputProps={register("confirmNewPassword", {
                required: "This field is required",
              })}
              isInputActive={isConfirmNewPasswordInputActive}
              setIsInputActive={setIsConfirmNewPasswordInputActive}
            />
            <span className="text-right text-sm text-warning">
              {formState.errors.confirmNewPassword && (
                <p>{formState.errors.confirmNewPassword.message}</p>
              )}
            </span>
          </div>
          <span className="text-right text-sm text-warning">
            {formState.errors.root && <p>{formState.errors.root.message}</p>}
          </span>
          <div className="flex justify-end">
            {!formState.isSubmitting && (
              <button
                disabled={
                  formState.isSubmitting || !areAllInputsActive || isLoading
                }
                className={
                  (areAllInputsActive
                    ? "bg-primary hover:bg-indigo-700"
                    : "bg-gray-300") +
                  " text-white text-sm font-semibold py-2 px-4 w-40 rounded-md flex justify-center ease-in-out duration-300 " +
                  GeistSans.className
                }
                type="submit"
              >
                Reset Password
              </button>
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
      </Card>
    </div>
  );
};

export default PasswordResetForm;
