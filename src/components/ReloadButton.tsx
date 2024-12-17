import { RefObject } from 'react';
import { IoReloadOutline } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';

interface ReloadButtonProps {
  iframeRef: RefObject<HTMLIFrameElement>;
}

export function ReloadButton({ iframeRef }: ReloadButtonProps) {
  const handleReload = () => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.location.reload();
      }
    }
  };

  return (
    <>
      <button
        onClick={handleReload}
        className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7B66]"
        data-tooltip-id="reload-tooltip"
        data-tooltip-content="Reload preview"
      >
        <IoReloadOutline size={20} />
      </button>
      <Tooltip
        id="reload-tooltip"
        place="left"
        className="!bg-gray-800 !px-2 !py-1 !text-sm !z-50"
      />
    </>
  );
}
