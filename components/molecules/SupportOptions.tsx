import { ArrowUpRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import discordIcon from '../../assets/discord-icon.svg'
import telegramIcon from '../../assets/telegram-icon.svg'
import githubIcon from '../../assets/github-icon.svg'
import envelopeIcon from '../../assets/envelope-icon.svg'
import Link from 'next/link'
import { VALIDATOR_GUI_DOCS_URL, VALIDATOR_GUI_FAQS_URL } from '../../pages/onboarding'
import { BgImage } from '../atoms/BgImage'

type SupportOptionsProps = {
  onClose: () => void
}

export const SupportOptions = ({ onClose }: SupportOptionsProps) => {
  return (
    <div className="flex flex-col items-center p-4 gap-y-4">
      <div className="flex items-center justify-between w-full">
        <span className="font-semibold">Get Help</span>
        <XMarkIcon className="h-4 w-4 cursor-pointer" onClick={onClose} />
      </div>
      <div className="flex flex-col text-xs">
        {/* Discord */}
        <div className="flex gap-x-3">
          <div className="flex flex-col justify-start">
            <span className="h-4 w-6 mt-1">
              <BgImage src={discordIcon} alt="disk-icon" />
            </span>
          </div>
          <div className="flex flex-col">
            <Link
              className="flex gap-x-1 cursor-pointer items-center py-1"
              href="https://discord.com/invite/shardeum"
              target="_blank"
            >
              <span className="font-semibold">Join Discord</span>
              <ArrowUpRightIcon className="h-2.5 w-3 text-gray-500" />
            </Link>
            <span className="bodyFg font-light">Get help from community and core contributors of Shardeum.</span>
          </div>
        </div>
        <hr className="my-2" />

        {/* Telegram */}
        {/* <div className="flex gap-x-3">
          <div className="flex flex-col justify-start"> */}
        {/* <span className="h-4 w-5 mt-1">
          <BgImage src={telegramIcon} alt="disk-icon" />
        </span> */}
        {/*
          </div>
          <div className="flex flex-col">
            <Link
              className="flex gap-x-1 cursor-pointer items-center py-1"
              href="https://t.me/s/shardeum"
              target="_blank"
            >
              <span className="font-semibold">Join Telegram</span>
              <ArrowUpRightIcon className="h-2.5 w-3 text-gray-500" />
            </Link>
            <span className="bodyFg font-light">
              Be a part of active discussions on our Telegram channel.
            </span>
          </div>
        </div>
        <hr className="my-2" /> */}

        {/* Github */}
        <div className="flex gap-x-3">
          <div className="flex flex-col justify-start">
            <span className="h-4 w-5 mt-1">
              <BgImage src={githubIcon} alt="disk-icon" />
            </span>
          </div>
          <div className="flex flex-col">
            <Link
              className="flex gap-x-1 cursor-pointer items-center py-1"
              href="https://github.com/shardeum"
              target="_blank"
            >
              <span className="font-semibold">View Github</span>
              <ArrowUpRightIcon className="h-2.5 w-3 text-gray-500" />
            </Link>
            <span className="bodyFg font-light">View validator GUI issues repository on Github.</span>
          </div>
        </div>
        {/* <hr className="my-2" /> */}

        {/* Mail */}
        {/* <div className="flex gap-x-3">
          <div className="flex flex-col justify-start"> */}
        {/* <span className="h-4 w-5 mt-1">
          <BgImage src={envelopeIcon} alt="disk-icon" />
        </span> */}
        {/*
          </div>
          <div className="flex flex-col">
            <Link
              className="flex gap-x-1 cursor-pointer items-center py-1 tooltip"
              href="mailto:support@shardeum.org"
              target="_blank"
              data-tip="support@shardeum.org"
            >
              <span className="font-semibold">Write to us</span>
              <ArrowUpRightIcon className="h-2.5 w-3 text-gray-500" />
            </Link>
            <span className="bodyFg font-light">
              Get support from Shardeum team.
            </span>
          </div>
        </div> */}
      </div>
      <div className="flex mt-4 gap-x-3 w-full">
        <Link href={VALIDATOR_GUI_FAQS_URL} target="_blank" className="w-full">
          <button className="text-primary border py-1.5 px-4 text-sm rounded font-medium w-full">FAQs</button>
        </Link>
        <Link href={VALIDATOR_GUI_DOCS_URL} target="_blank">
          <button className="text-primary border py-1.5 px-4 text-sm rounded font-medium">Documentation</button>
        </Link>
      </div>
    </div>
  )
}
