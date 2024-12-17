import { useState } from 'react';
import { IoShareOutline } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';

interface ShareButtonProps {
  sessionId?: string;
  version?: string;
  onShare: () => Promise<void>;
  disabled?: boolean;
}

export function ShareButton({ sessionId, version, onShare, disabled }: ShareButtonProps) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    await onShare();
    const url = `/apps/${sessionId}/${version}`;
    await navigator.clipboard.writeText(window.location.origin + url);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <>
      <button
        onClick={handleShare}
        disabled={disabled}
        className={`p-2 bg-white rounded-lg shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7B66] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        data-tooltip-id="share-tooltip"
        data-tooltip-content={shared ? 'URL copied!' : disabled ? 'Sharing not available yet' : 'Share this page'}
      >
        <IoShareOutline size={20} />
      </button>
      <Tooltip
        id="share-tooltip"
        place="left"
        className="!bg-gray-800 !px-2 !py-1 !text-sm !z-50"
      />
    </>
  );
}
