import React from 'react'
import { useForm } from 'react-hook-form'
import LoadingButton from './LoadingButton'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { usePassword } from '../hooks/usePasswordChange'

type FormData = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

const ResetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
  })
  const { changePassword, isLoading } = usePassword({ setError })

  const onSubmit = (data: FormData) => {
    changePassword(data.currentPassword, data.newPassword)
  }

  // use watch to get the current password value to confirm
  const password = watch('newPassword', '')

  return (
    <>
      <h1 className="font-semibold mb-3 mt-4 text-lg">Change Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-[21rem]">
        <div className="flex justify-between mt-2">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            className="bg-white text-black border px-1"
            id="currentPassword"
            type="password"
            {...register('currentPassword', {
              required: 'This field is required',
            })}
          />
        </div>
        <span className="text-right text-sm text-warning">
          {errors.currentPassword && <p>{errors.currentPassword.message}</p>}
        </span>

        <div className="flex justify-between mt-2">
          <label htmlFor="newPassword">New Password</label>
          <input
            className="bg-white text-black border px-1"
            id="newPassword"
            type="password"
            {...register('newPassword', { required: 'This field is required' })}
          />
        </div>
        <span className="text-right text-sm text-warning">
          {errors.newPassword && <p>{errors.newPassword.message}</p>}
        </span>

        <div className="flex justify-between mt-2">
          <label htmlFor="confirmNewPassword">Confirm Password</label>
          <input
            className="bg-white text-black border px-1"
            id="confirmNewPassword"
            type="password"
            {...register('confirmNewPassword', {
              required: 'This field is required',
              validate: (value) => value === password || 'The passwords do not match',
            })}
          />
        </div>
        <span className="text-right text-sm text-warning">
          {errors.confirmNewPassword && <p>{errors.confirmNewPassword.message}</p>}
        </span>

        <div className="flex justify-end mt-2">
          <LoadingButton className="btn btn-primary" isLoading={isLoading} disabled={!isValid} type="submit">
            Submit
            <ArrowRightIcon className="h-5 w-5 inline ml-2" />
          </LoadingButton>
        </div>
      </form>
    </>
  )
}

export default ResetPasswordForm
