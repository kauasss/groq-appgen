import { useState } from 'react';
import { IoCopyOutline } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';

interface CopyButtonProps {
  code: string;
}

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={handleCopy}
        className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7B66]"
        data-tooltip-id="copy-tooltip"
        data-tooltip-content={copied ? 'Copied!' : 'Copy code'}
      >
        <IoCopyOutline size={20} />
      </button>
      <Tooltip
        id="copy-tooltip"
        place="left"
        className="!bg-gray-800 !px-2 !py-1 !text-sm !z-50"
      />
    </>
  );
}
